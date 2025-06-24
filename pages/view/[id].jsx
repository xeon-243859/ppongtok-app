import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../src/firebase";

import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [previewData, setPreviewData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 데이터 불러오기: localStorage에서 미리보기 데이터 읽어오기
  useEffect(() => {
    if (!router.isReady || id !== "preview") return;

    const type = localStorage.getItem("selected-type");
    const message = localStorage.getItem("message");
    const musicSrc = localStorage.getItem("selected_music_src");
    const videoUrl = localStorage.getItem("selected-video");

    const data = {
      type,
      message,
      music: musicSrc,
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
      data.videoUrl = videoUrl;
    }

    setPreviewData(data);
  }, [router.isReady, id]);

  // 이미지 슬라이드 타이머: 안전하게 currentImageIndex 업데이트
  useEffect(() => {
    if (previewData?.type === "image" && previewData.imageUrls?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          previewData.imageUrls.length
            ? (prevIndex + 1) % previewData.imageUrls.length
            : 0
        );
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [previewData]);

  // 공유 처리: Firestore에 저장 후 공유 페이지로 이동
  const handleShare = async () => {
    if (!previewData) return;
    setIsSaving(true);

    const dataToSave = { ...previewData };
    const newId = `msg_${Date.now()}`;

    try {
      if (dataToSave.type === "image" && dataToSave.imageUrls?.length > 0) {
        const downloadUrls = await Promise.all(
          dataToSave.imageUrls.map((base64, index) => {
            const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
            return uploadString(imageRef, base64, "data_url").then(() =>
              getDownloadURL(imageRef)
            );
          })
        );
        dataToSave.imageUrls = downloadUrls;
      }

      const docRef = doc(db, "messages", newId);
      await setDoc(docRef, dataToSave);
      router.push(`/share/${newId}`);
    } catch (error) {
      console.error("🔥 Firestore 저장 오류:", error);
      alert("메시지를 저장하는 데 실패했습니다. 다시 시도해주세요.");
      setIsSaving(false);
    }
  };

  if (!previewData) {
    return <p className={styles.loadingText}>미리보기를 생성 중입니다...</p>;
  }

  // 안전한 이미지 URL 변수 (undefined 방지)
  const safeImageUrl =
    previewData?.type === "image" &&
    previewData?.imageUrls &&
    previewData.imageUrls[currentImageIndex]
      ? previewData.imageUrls[currentImageIndex]
      : null;

  return (
    <>
      <Head>
        <title>메시지 미리보기</title>
      </Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>✨ 생성된 메시지 미리보기</h2>
        <div className={styles["moving-box"]}>
          {previewData?.type === "video" && previewData?.videoUrl && (
            <video
              src={previewData.videoUrl}
              controls
              autoPlay
              loop
              muted
              className={styles["media-element"]}
            />
          )}
          {previewData?.type === "image" &&
            previewData?.imageUrls?.length > 0 &&
            safeImageUrl && (
              <img
                key={currentImageIndex}
                src={safeImageUrl}
                alt={`slide-${currentImageIndex}`}
                className={styles.slideImage}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
          )}
          {previewData?.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>
                {previewData.message}
              </div>
            </div>
          )}
        </div>
        {previewData?.music && (
          <audio
            src={previewData.music}
            controls
            autoPlay
            style={{ width: "90%", maxWidth: "500px", marginTop: "15px" }}
          />
        )}
        <div className={styles["preview-button-group"]}>
          <button
            className={styles["preview-button"]}
            onClick={() => router.back()}
          >
            뒤로가기
          </button>
          <button
            className={`${styles["preview-button"]} ${styles.highlight}`}
            onClick={handleShare}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : "공유하기"}
          </button>
        </div>
      </div>
    </>
  );
}
