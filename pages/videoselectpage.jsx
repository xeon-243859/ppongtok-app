import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/VideoSelectPage.module.css";

export default function VideoSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showLine1, setShowLine1] = useState(true);
  const [showLine2, setShowLine2] = useState(false);
  const [lastPage, setLastPage] = useState("/");

  // 텍스트 애니메이션
  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine2(true), 1500);
    return () => clearTimeout(timer1);
  }, []);

  // localStorage 접근 (브라우저에서만)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVideo = localStorage.getItem("selected-video");
      const storedType = localStorage.getItem("selected-type");
      const confirmed = localStorage.getItem("video-theme-confirmed");

      if (storedVideo && storedType === "video" && !storedVideo.includes("river")) {
        setSelectedVideo(storedVideo);
        console.log("🎥 사용자 영상 불러옴:", storedVideo);
      } else {
        console.warn("⚠️ 강물.mp4 또는 타입 오류 → 무시:", storedVideo);
      }

      setLastPage(localStorage.getItem("last-page") || "/");
    }
  }, []);

  const handleThemeSelect = (filename = "flower.mp4") => {
    const videoPath = `/videos/${filename}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-video-source", "theme");
      localStorage.setItem("selected-video", videoPath);
      localStorage.setItem("selected-type", "video");
    }
    setSelectedVideo(videoPath);
    router.push("/videothemepage");
  };

  const handleLocalSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      if (typeof window !== "undefined") {
        localStorage.setItem("selected-video", videoUrl);
        localStorage.setItem("selected-video-source", "local");
        localStorage.setItem("selected-type", "video");
      }
    }
  };

  const handleDelete = () => {
    setSelectedVideo(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("selected-video");
      localStorage.removeItem("selected-video-source");
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined") {
      const target = localStorage.getItem("last-page") || "/";
      console.log("🧭 뒤로가기:", target);
      setTimeout(() => {
        router.replace(target);
      }, 100);
    }
  };

  const handleNext = () => {
  if (!selectedVideo) {
    alert("🎥 영상을 선택해주세요!");
    return;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("selected-video", selectedVideo);
    localStorage.setItem("selected-type", "video");
    localStorage.setItem("allow-music", "true");

     const messageId = localStorage.getItem("message-id") || "test01";
    localStorage.setItem("message-id", messageId);

    setTimeout(() => {
      router.push("/musicselectpage");
    }, 100);
  }
};


  return (
    <div className={styles.videoTitleGroup}>
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
         <p className={styles.fileLimitNotice}>
        ※ 10MB 이하의 파일만 업로드 가능합니다.
         </p>
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
  <button onClick={handleBack}>뒤로가기</button>
  <button onClick={handleNext}>다음으로</button>
   </div>
   </div>
   );
   }