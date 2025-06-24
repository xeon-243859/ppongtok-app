// ✅ view/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "./viewpreview.module.css";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function ViewMessagePreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [previewData, setPreviewData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const docRef = doc(db, "previews", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPreviewData(docSnap.data());
      }
    };
    fetchData();
  }, [id]);

  const handleShare = () => {
    router.push(`/share/${id}`);
  };

  return (
    <>
      <Head><title>구성된 메시지 미리보기</title></Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>✨ 개성된 메시지 미리보기</h2>
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
            Array.isArray(previewData.imageUrls) &&
            previewData.imageUrls.length > 0 &&
            typeof currentImageIndex === "number" &&
            previewData.imageUrls[currentImageIndex] && (
              <img
                key={currentImageIndex}
                src={previewData.imageUrls[currentImageIndex]}
                alt={`slide-${currentImageIndex}`}
                className={styles.slideImage}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "contain"
                }}
              />
            )}

          {previewData?.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>{previewData.message}</div>
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
          <button className={styles["preview-button"]} onClick={() => router.back()}>
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
