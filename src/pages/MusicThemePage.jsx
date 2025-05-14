// ✅ MusicThemePage.jsx (음원 테마 선택만 하고 머무는 버전)

import React from "react";
import { useNavigate } from "react-router-dom";
import "./MusicThemePage.css";

const themes = [
  { name: "봄의노래", file: "/audio/spring.mp3" },
  { name: "설레임", file: "/audio/spring1.mp3" },
  { name: "무언의 감정", file: "/audio/mueon.mp3" },
  { name: "고요한 바람", file: "/audio/mueon1.mp3" }
];

const MusicThemePage = () => {
  const navigate = useNavigate();

  const handleThemeClick = (theme) => {
    localStorage.setItem("selected-music", theme.file);
    localStorage.setItem("selected-music-name", theme.name); // 이름 저장도 일치하게
    // ✅ navigate 없음: stay at current page
    // 필요 시 navigate("/preview") 가능
  };

  return (
    <div className="music-theme-page">
      <h2>음원 테마 저장소</h2>
      {themes.map((theme) => (
        <button
          key={theme.file}
          className="theme-button"
          onClick={() => handleThemeClick(theme)}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};

export default MusicThemePage;
