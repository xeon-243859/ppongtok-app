// ppongtok-app/pages/musicthemepage.jsx (실제 폴더 경로로 수정 완료)

import React from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicthemepage.module.css";

const musicOptions = [
  // ▼▼▼▼▼ [수정] 모든 경로를 실제 폴더 이름인 '/audio/' 로 수정합니다. ▼▼▼▼▼
  { label: "봄의노래", value: "/audio/spring.mp3" },
  { label: "설레임", value: "/audio/spring1.mp3" },
  { label: "무언의 감정", value: "/audio/mueon.mp3" },
  { label: "고요한 바람", value: "/audio/mueon1.mp3" }
  // ▲▲▲▲▲ [수정] ▲▲▲▲▲
];

export default function MusicThemePage() {
  const router = useRouter();

  const handleSelect = (value, label) => {
    localStorage.setItem("selected-music", value);
    localStorage.setItem("selected-music-label", label);
    router.push("/musicselectpage");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>🎵 음원 테마 저장소</h1>
        <div className={styles.musicList}>
          {musicOptions.map((option) => (
            <button
              key={option.value}
              className={styles.musicButton}
              onClick={() => handleSelect(option.value, option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className={styles.navButtonContainer}>
          <button onClick={() => router.push('/musicselectpage')} className={styles.navButton}>
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
}