// ppongtok-app/pages/videothemepage.jsx (최종 확인용)

import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/VideoThemePage.module.css"; 

const videos = [
  { id: 1, src: "/videos/flower.mp4", label: "꽃 배경" },
  { id: 2, src: "/videos/sunflower.mp4", label: "해바라기 배경" },
  { id: 3, src: "/videos/sky.mp4", label: "하늘 배경" },
  { id: 4, src: "/videos/sunset.mp4", label: "노을 배경" },
];

export default function VideoThemePage() {
  const router = useRouter();

  const handleSelect = (src) => {
    console.log(`[ThemePage] 비디오 선택: ${src}. localStorage에 'selected-video-theme' 키로 저장.`);
    localStorage.setItem("selected-video-theme", src);
    router.push("/videoselectpage");
  };

  return (
    <div className={styles.videoThemePage}>
      <h2 className={styles.videoThemeTitle}>영상 배경을 선택해주세요</h2>
      <div className={styles.videoGrid}>
        {videos.map((video) => (
          <div key={video.id} className={styles.videoBox} onClick={() => handleSelect(video.src)}>
            <video src={video.src} muted loop playsInline className={styles.videoThumb} />
            <p className={styles.videoLabel}>{video.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}