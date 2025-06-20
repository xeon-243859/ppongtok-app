import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/VideoSelectPage.module.css";
import appStyles from "../src/styles/AppTheme.module.css";

export default function VideoSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 로컬스토리지에서 이전에 선택한 영상 불러오기
  useEffect(() => {
    const storedVideo = localStorage.getItem("selected-video");
    if (storedVideo) {
      setSelectedVideo(storedVideo);
    }
  }, []);

  const handleThemeSelect = () => {
    router.push("/videothemepage");
  };

  const handleLocalSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ 50MB 용량 제한 체크
      const MAX_SIZE_MB = 50;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`영상 파일의 크기가 너무 큽니다. (${MAX_SIZE_MB}MB 이하만 가능합니다)`);
        e.target.value = null;
        return;
      }
      
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      localStorage.setItem("selected-video", videoUrl);
    }
  };

  const handleNext = () => {
    if (!selectedVideo) {
      alert("🎥 영상을 선택해주세요!");
      return;
    }
    localStorage.setItem("selected-type", "video");
    localStorage.removeItem("selected-images");
    localStorage.setItem("allow-music", "true");
    router.push("/musicselectpage");
  };
  
  const handleBack = () => router.push('/style-select');

  return (
    <div className={`${appStyles.pageContainer} ${styles.pageLayout}`}>
      <h2 className={appStyles.pageTitle}>배경으로 사용할 영상을</h2>
      <h2 className={appStyles.pageTitle} style={{ marginTop: '-10px' }}>선택해 주세요</h2>

      <div className={styles.movingBox}>
        {selectedVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            loop
            muted
            className={styles.videoPreview}
          />
        ) : (
          <p className={styles.movingPlaceholder}>선택된 영상이 여기에 표시됩니다.</p>
        )}
      </div>
      
      <div className={appStyles.buttonGroup}>
        <button onClick={handleThemeSelect} className={appStyles.buttonPrimary}>테마 영상 선택</button>
        <button onClick={handleLocalSelect} className={appStyles.buttonPrimary}>내 파일 선택</button>
      </div>
      
      <p className={appStyles.pageDescription} style={{ fontSize: '14px', marginTop: '10px' }}>
        ※ 50MB 이하의 영상 파일을 권장합니다.
      </p>

      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className={appStyles.navButtonContainer}>
        <button onClick={handleBack} className={appStyles.buttonSecondary}>뒤로가기</button>
        <button onClick={handleNext} className={appStyles.buttonPrimary}>다음으로</button>
      </div>
    </div>
  );
}