// ppongtok-app/pages/musicthemepage.jsx (데이터 형식 통일 완료)

import React from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicthemepage.module.css";

// [수정] 데이터 형식을 { id, title, src } 형태로 통일합니다.
const musicOptions = [
  { id: 'theme1', title: "봄의 노래", src: "/audio/spring.mp3" },
  { id: 'theme2', title: "설레임", src: "/audio/spring1.mp3" },
  { id: 'theme3', title: "무언의 감정", src: "/audio/mueon.mp3" },
  { id: 'theme4', title: "고요한 바람", src: "/audio/mueon1.mp3" },
  // 여기에 더 많은 테마 음악을 추가할 수 있습니다.
];

export default function MusicThemePage() {
  const router = useRouter();

  // [수정] handleSelect 함수에서 src와 title을 함께 넘겨줍니다.
  const handleSelect = (src, title) => {
    localStorage.setItem("selected-music", src);
    localStorage.setItem("selected-music-label", title);
    router.push("/musicselectpage");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>🎵 음원 테마 저장소</h1>
        <div className={styles.musicList}>
          {musicOptions.map((option) => (
            <button
              key={option.id} // key는 고유한 id 사용
              className={styles.musicButton}
              onClick={() => handleSelect(option.src, option.title)} // src와 title을 전달
            >
              {option.title} {/* 화면에는 title 표시 */}
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