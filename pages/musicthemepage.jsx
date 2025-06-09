import React from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter
import styles from "./MusicThemePage.module.css"; // ✅ .css → .module.css

const musicOptions = [
  { label: "봄의노래", value: "/audio/spring.mp3" },
  { label: "설레임", value: "/audio/spring1.mp3" },
  { label: "무언의 감정", value: "/audio/mueon.mp3" },
  { label: "고요한 바람", value: "/audio/mueon1.mp3" }
];

export default function MusicThemePage() {
  const router = useRouter(); // ✅ useNavigate → useRouter

  const handleSelect = (value, label) => {
    localStorage.setItem("selected-music", value);
    localStorage.setItem("selected-music-label", label); // ✅ 음악 제목 저장
    router.push("/music/select"); // ✅ navigate → router.push
  };

  return (
    <div className={styles["music-theme-page"]}>
      <h2 className={styles["music-theme-title"]}>🎵 음원 테마 저장소</h2>
      <div className={styles["music-grid-vertical"]}>
        {musicOptions.map((option) => (
          <button
            key={option.value}
            className={styles["music-button"]}
            onClick={() => handleSelect(option.value, option.label)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
