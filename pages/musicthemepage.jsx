// ppongtok-app/pages/musicthemepage.jsx (디자인 통일 완료)

import React from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicthemepage.module.css"; // CSS 모듈 경로 확인

const musicOptions = [
  { label: "봄의노래", value: "/music/spring.mp3" }, // 경로를 /music/ 으로 통일
  { label: "설레임", value: "/music/spring1.mp3" }, // 경로를 /music/ 으로 통일
  { label: "무언의 감정", value: "/music/mueon.mp3" }, // 경로를 /music/ 으로 통일
  { label: "고요한 바람", value: "/music/mueon1.mp3" } // 경로를 /music/ 으로 통일
];

export default function MusicThemePage() {
  const router = useRouter();

  const handleSelect = (value, label) => {
    localStorage.setItem("selected-music", value);
    localStorage.setItem("selected-music-label", label);
    router.push("/musicselectpage");
  };

  return (
    // [수정] 전체적인 클래스 이름을 다른 페이지와 통일
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
        {/* [추가] 뒤로가기 버튼 추가하여 UX 개선 */}
        <div className={styles.navButtonContainer}>
          <button onClick={() => router.push('/musicselectpage')} className={styles.navButton}>
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
}