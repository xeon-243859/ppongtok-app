import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router"; // ✅ react-router-dom → next/router
import styles from "@/styles/VideoSelectPage.module.css"; // ✅ CSS 모듈 적용

export default function VideoSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showLine1, setShowLine1] = useState(true);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine2(true), 1500);
    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    const storedVideo = localStorage.getItem("selected-video");
    const storedType = localStorage.getItem("selected-type");
    const confirmed = localStorage.getItem("video-theme-confirmed");

    if (
      storedVideo &&
      storedType === "video" &&
      !storedVideo.includes("river")
    ) {
      setSelectedVideo(storedVideo);
      console.log("🎥 사용자 영상 불러옴:", storedVideo);
    } else {
      console.warn("⚠️ 강물.mp4 또는 타입 오류 → 무시:", storedVideo);
    }
  }, []);

  const lastPage = localStorage.getItem("last-page") || "/";

  const handleThemeSelect = (filename = "flower.mp4") => {
    const videoPath = `/videos/${filename}`;
    localStorage.setItem("selected-video-source", "theme");
    localStorage.setItem("selected-video", videoPath);
    localStorage.setItem("selected-type", "video");
    setSelectedVideo(videoPath);
    router.push("/video/theme");
  };

  const handleLocalSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      localStorage.setItem("selected-video", videoUrl);
      localStorage.setItem("selected-video-source", "local");
      localStorage.setItem("selected-type", "video");
    }
  };

  const handleDelete = () => {
    setSelectedVideo(null);
    localStorage.removeItem("selected-video");
    localStorage.removeItem("selected-video-source");
  };

  const handleBack = () => {
    const target = localStorage.getItem("last-page") || "/";
    console.log("🧭 뒤로가기:", target);
    setTimeout(() => {
      router.replace(target); // ✅ Next.js 방식
    }, 100);
  };

  return (
    <div className={styles.videoSelectContainer}>
      {showLine1 && <h2 className={styles.videoTitleLine1}>배경으로 사용할 영상파일 1개를</h2>}
      {showLine2 && <h2 className={styles.videoTitleLine2}>선택해 주세요</h2>}

      <div className={styles.videoButtonGroup}>
        <button onClick={handleThemeSelect}>동영상파일</button>
        <button onClick={handleLocalSelect}>내파일선택</button>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className={styles.movingBox}>
        {selectedVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            loop
            muted
            style={{
              width: "320px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        ) : (
          <p className={styles.movingPlaceholder}>moving file</p>
        )}
      </div>

      <div className={styles.videoButtonNav}>
        <button
          onClick={() => window.location.replace("/style/select")}
        >
          뒤로가기
        </button>
        <button
          onClick={() => {
            localStorage.setItem("allow-music", "true");
            router.push("/music/select");
          }}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
