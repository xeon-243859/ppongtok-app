import React from "react";
import { useNavigate } from "react-router-dom";
import "./MusicThemePage.css";

const musicOptions = [
  { label: "봄의노래", value: "/audio/spring.mp3" },
  { label: "설레임", value: "/audio/spring1.mp3" },
  { label: "무언의 감정", value: "/audio/mueon.mp3" },
  { label: "고요한 바람", value: "/audio/mueon1.mp3" }
];

const MusicThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (value) => {
    localStorage.setItem("selected-music", value);
    navigate("/music/select"); // ✅ 클릭 후 음악선택화면으로 이동
  };

  return (
    <div className="music-theme-page">
      <h2 className="music-theme-title">🎵 음원 테마 저장소</h2>
      <div className="music-grid-vertical">
        {musicOptions.map((option) => (
          <button
            key={option.value}
            className="music-button"
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicThemePage;
