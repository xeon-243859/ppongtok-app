// viewpreview.js

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
  // useAuth에서 googleLogin 함수를 가져옵니다.
  const { user, dbUser, loading, googleLogin } = useAuth();

  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;

    // localStorage에서 데이터를 복구하는 로직은 그대로 유지합니다.
    const getInitialData = () => {
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
      } else {
        // 이 부분은 로그인 후 돌아왔을 때를 대비한 것인데,
        // 새로운 로직에서는 필요성이 줄어들지만 만약을 위해 남겨둡니다.
        const saved = localStorage.getItem("previewData");
        if (saved) {
          setPreviewData(JSON.parse(saved));
        } else {
          alert("미리보기 데이터를 불러올 수 없습니다. 처음부터 다시 시도해주세요.");
          router.push("/");
        }
      }
    };
    
    getInitialData();

  }, [router.isReady, id]); // router는 의존성에서 제거해도 좋습니다.

  useEffect(() => {
    if (previewData?.type === "image" && previewData.imageUrls?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % previewData.imageUrls.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [previewData]);


  // =================================================================
  //  핵심 수정: handleShare 함수
  // =================================================================
  const handleShare = async () => {
    setIsProcessing(true);
    console.log("🐛 공유 버튼 눌림. 처리 시작...");

    // 1. 데이터 유효성 검사
    if (!previewData) {
      alert("미리보기 데이터가 없습니다. 새로고침 후 다시 시도해주세요.");
      setIsProcessing(false);
      return;
    }
    
    // 2. 로그인 상태 확인 및 처리 (가장 큰 변경점)
    if (!user) {
      alert("메시지를 저장하고 공유하려면 로그인이 필요해요!");
      const loginSuccess = await googleLogin(); // 페이지 이동 없이 바로 로그인 시도

      if (!loginSuccess) {
        // 사용자가 팝업을 닫거나 로그인에 실패한 경우
        setIsProcessing(false);
        return;
      }
      // 로그인 성공 시, AuthContext의 onAuthStateChanged가 user 상태를 업데이트합니다.
      // 하지만 상태 업데이트가 즉시 반영되지 않을 수 있으므로,
      // 후속 로직은 user 상태를 감지하는 useEffect에서 처리하거나,
      // 잠시 기다린 후 다시 handleShare를 호출하는 것이 안정적입니다.
      // 여기서는 잠시 후 다시 시도하라는 안내를 하고 함수를 종료합니다.
      // 사용자는 로그인된 상태로 버튼을 다시 누르면 됩니다. (개선된 UX)
      alert("로그인되었습니다! 이제 '공유하기' 버튼을 다시 눌러주세요.");
      setIsProcessing(false);
      return;
    }
    
    // 3. 사용자 DB 정보 및 이용권 확인
    // 로딩이 끝나고 user는 있는데 dbUser가 없는 경우를 명확히 처리
    if (loading) {
      alert("사용자 정보를 확인 중입니다. 잠시 후 다시 시도해주세요.");
      setIsProcessing(false);
      return;
    }

    if (!dbUser) {
      // 이 경우는 거의 없지만, DB에 사용자 문서 생성이 실패한 경우를 대비
      alert("사용자 정보를 불러오는데 실패했습니다. 다시 로그인해주세요.");
      setIsProcessing(false);
      return;
    }

    if (dbUser.freePassRemaining <= 0) {
      alert("이용권이 모두 소진되었어요. 이용권을 먼저 구매해주세요!");
      router.push("/paymentpage");
      setIsProcessing(false);
      return;
    }

    // 4. Firebase에 데이터 저장 (기존 로직)
    try {
      console.log("🛠️ Firebase 저장 절차 시작");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        freePassRemaining: dbUser.freePassRemaining - 1,
      });
      console.log("✅ 이용권 차감 완료");

      // 원본 previewData를 수정하지 않기 위해 복사
      const dataToSave = {
        ...previewData,
        authorUid: user.uid,
        authorName: user.displayName || "이름없음",
        createdAt: new Date(), // 서버 타임스탬프로 변경하는 것을 권장 (serverTimestamp())
      };

      const newId = `msg_${Date.now()}`;
      console.log("🔥 Firestore 저장 시작:", newId);

      if (dataToSave.type === "image" && dataToSave.imageUrls.length > 0) {
        console.log("🖼️ 이미지 업로드 시작...");
        const downloadUrls = await Promise.all(
          dataToSave.imageUrls.map(async (base64, index) => {
            // base64 문자열이 유효한지 확인
            if (!base64.startsWith('data:')) {
                console.error(`잘못된 base64 형식입니다: index ${index}`);
                return null;
            }
            const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
            await uploadString(imageRef, base64, "data_url");
            const url = await getDownloadURL(imageRef);
            console.log(`✅ 이미지 ${index} 업로드 성공`);
            return url;
          })
        );
        dataToSave.imageUrls = downloadUrls.filter(Boolean); // null 값 제거
      }

      const messageDocRef = doc(db, "messages", newId);
      await setDoc(messageDocRef, dataToSave);
      console.log("✅ Firestore에 메시지 저장 완료");

      // 성공 후 로컬 데이터 정리
      localStorage.removeItem("previewData");
      localStorage.removeItem("selected-type");
      // ... 기타 관련 localStorage 아이템들

      router.push(`/share/${newId}`);

    } catch (error) {
      console.error("🔥 최종 저장/공유 단계 오류:", error.message, error);
      alert("메시지를 저장하는 데 실패했습니다. 오류가 지속되면 관리자에게 문의해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };


  if (!previewData) {
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
            disabled={isProcessing || loading} // 로딩 중일 때도 비활성화
          >
            {isProcessing ? "처리 중..." : (loading ? "정보 확인 중..." : "공유하기")}
          </button>
        </div>
      </div>
    </>
  );
}