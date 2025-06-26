import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../src/firebase";
import styles from "../../src/styles/viewpreview.module.css";
import { useAuth } from "../../src/contexts/AuthContext";

export const dynamic = "force-dynamic";

export default function ViewMessagePreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, dbUser, loading } = useAuth();

  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;

    if (id === "preview") {
      const type = localStorage.getItem("selected-type");
      const message = localStorage.getItem("message");
      if (!type) {
        alert("필수 정보가 없어 메시지를 생성할 수 없습니다. 처음부터 다시 시도해주세요.");
        router.push("/");
        return;
      }

      const data = {
        type,
        message: message || "",
        music: localStorage.getItem("selected_music_src"),
        imageUrls: [],
        videoUrl: null,
        createdAt: new Date(),
      };

      if (type === "image") {
        const images = [];
        for (let i = 0; i < 4; i++) {
          const img = localStorage.getItem(`ppong_image_${i}`);
          if (img) images.push(img);
        }
        data.imageUrls = images;
      } else if (type === "video") {
        data.videoUrl = localStorage.getItem("selected-video");
      }

      setPreviewData(data);
      localStorage.setItem("previewData", JSON.stringify(data));
    } else {
      const saved = localStorage.getItem("previewData");
      if (saved) {
        console.log("🧪 previewData 로컬에서 복구됨");
        setPreviewData(JSON.parse(saved));
      } else {
        alert("미리보기 데이터를 불러올 수 없습니다. 처음부터 다시 시도해주세요.");
        router.push("/");
      }
    }
  }, [router.isReady, id, router]);

  useEffect(() => {
    if (previewData?.type === "image" && previewData.imageUrls?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % previewData.imageUrls.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [previewData]);

    const handleShare = async () => {
  setIsProcessing(true);
  console.log("🐛 공유 버튼 눌림");
  console.log("🐛 previewData:", previewData);

  // 🔒 previewData 없는 경우 에러 방지
  if (!previewData) {
    alert("미리보기 데이터가 아직 준비되지 않았어요. 다시 시도해주세요.");
    console.error("❌ previewData 없음!");
    setIsProcessing(false);
    return;
  }

  // localStorage에 저장 (로그인 후 리다이렉트용)
  localStorage.setItem("previewData", JSON.stringify(previewData));

  // 로그인 검사
  if (!user) {
    alert("메시지를 저장하고 공유하려면 로그인이 필요해요!");
    localStorage.setItem("afterLoginRedirect", router.asPath);
    router.push("/loginpage");
    setIsProcessing(false);
    return;
  }

  if (loading) {
    alert("사용자 정보를 확인 중입니다. 잠시 후 다시 시도해주세요.");
    setIsProcessing(false);
    return;
  }

  if (!dbUser) {
    alert("사용자 정보를 불러오는데 실패했습니다. 다시 로그인해주세요.");
    router.push("/loginpage");
    setIsProcessing(false);
    return;
  }


    const hasTickets = dbUser.freePassRemaining > 0;
    if (!hasTickets) {
      alert("이용권이 모두 소진되었어요. 이용권을 먼저 구매해주세요!");
      router.push("/paymentpage");
      setIsProcessing(false);
      return;
    }

    try {
      console.log("🛠️ handleShare 시작");

      if (!previewData) throw new Error("미리보기 데이터가 없습니다.");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        freePassRemaining: dbUser.freePassRemaining - 1,
      });
      console.log("✅ 이용권 차감 완료");

      const dataToSave = {
        ...previewData,
        authorUid: user.uid,
        authorName: user.displayName || "이름없음",
      };

      const newId = `msg_${Date.now()}`;
      console.log("🔥 Firestore 저장 시작:", newId);

      if (dataToSave.type === "image" && dataToSave.imageUrls.length > 0) {
        const downloadUrls = await Promise.all(
          dataToSave.imageUrls.map(async (base64, index) => {
            try {
              const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
              await uploadString(imageRef, base64, "data_url");
              return await getDownloadURL(imageRef);
            } catch (err) {
              console.error(`이미지 ${index} 업로드 실패:`, err);
              return null;
            }
          })
        );
        dataToSave.imageUrls = downloadUrls.filter(Boolean);
      }

      const messageDocRef = doc(db, "messages", newId);
      await setDoc(messageDocRef, dataToSave);
      console.log("✅ Firestore에 메시지 저장 완료");

      router.push(`/share/${newId}`);
    } catch (error) {
      console.error("🔥 최종 저장/공유 단계 오류:", error.message, error);
      alert("메시지를 저장하는 데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!previewData) {
    console.error("❌ previewData가 없음");
    return <p className={styles.loadingText}>미리보기를 생성 중입니다...</p>;
  }

  return (
    <>
      <Head>
        <title>메시지 미리보기</title>
      </Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>✨ 생성된 메시지 미리보기</h2>

        <div className={styles["moving-box"]}>
          {previewData.type === "video" && previewData.videoUrl && (
            <video
              src={previewData.videoUrl}
              controls
              autoPlay
              loop
              muted
              className={styles["media-element"]}
            />
          )}
          {previewData.type === "image" && previewData.imageUrls.length > 0 && (
            <img
              key={currentImageIndex}
              src={previewData.imageUrls[currentImageIndex]}
              alt={`slide-${currentImageIndex}`}
              className={styles.slideImage}
            />
          )}
          {previewData.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>{previewData.message}</div>
            </div>
          )}
        </div>

        {previewData.music && (
          <audio
            src={previewData.music}
            controls
            autoPlay
            style={{ width: "90%", maxWidth: "500px", marginTop: "15px" }}
          />
        )}

        <div className={styles["preview-button-group"]}>
          <button className={styles["preview-button"]} onClick={() => router.back()}>
            뒤로가기
          </button>
          <button
          className={`${styles["preview-button"]} ${styles.highlight}`}
          onClick={handleShare}
          disabled={isProcessing || !previewData || loading}
>
           {isProcessing ? "처리 중..." : "공유하기"}
           </button>
        </div>
      </div>
    </>
  );
}
