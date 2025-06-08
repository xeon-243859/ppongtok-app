import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // ✅ react-router-dom → next/router
import styles from "@/styles/VideoEntryPage.module.css"; // ✅ CSS 모듈화

export default function VideoEntryPage() {
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 영상 선택된 상태 불러오기
  useEffect(() => {
    const stored = localStorage.getItem("selectedVideo");
    if (stored) {
      setSelectedVideo(JSON.parse(stored));
    }
  }, []);

  const handleRemove = () => {
    setSelectedVideo(null);
    localStorage.removeItem("selectedVideo");
  };

  return (
    <div className={styles.entryPageContainer}>
      <div className={styles.entryTextBlock}>
        <h1 className={styles.entryTitle}>배경으로 사용할 영상파일 1개를</h1>
        <h2 className={styles.entrySubtitle}>선택해주세요</h2>
      </div>

      <div className={styles.entryButtonGroup}>
        <button className={styles.entryButton} onClick={() => router.push("/video/select")}>
          동영상파일
        </button>
        <button className={styles.entryButton} onClick={() => router.push("/video/upload")}>
          내파일선택
        </button>
      </div>

      {selectedVideo && (
        <div className={styles.selectedVideoBox}>
          <video src={selectedVideo.src} controls width="100%" height="100%" />
          <div className={styles.movingLabel}>moving file</div>
          <button className={styles.removeButton} onClick={handleRemove}>X</button>
        </div>
      )}

      <div className={styles.navButtonGroup}>
        <button className={styles.navButton} onClick={() => router.back()}>뒤로가기</button>
        <button className={styles.navButton} onClick={() => router.push("/music/select")}>다음으로</button>
      </div>
    </div>
  );
}
