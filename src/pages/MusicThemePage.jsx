// ✅ MusicThemePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MusicThemePage.css";

const musicList = [
  { src: "/audio/mueon.mp3", label: "무언가" },
  { src: "/audio/spring.mp3", label: "봄의 노래" },
  { src: "/audio/mueon1.mp3", label: "무언가 2" },
  { src: "/audio/spring1.mp3", label: "봄의 노래 2" },
];

const MusicThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (musicPath) => {
    const slot = localStorage.getItem("selected-slot");
    if (!slot) {
      alert("저장할 슬롯이 설정되지 않았습니다.");
      return;
    }
    localStorage.setItem(slot, musicPath);
    localStorage.removeItem("selected-slot");
    navigate("/music/select");
  };

  return (
    <div className="music-theme-container">
      <h2>음원 테마 저장소</h2>
      <div className="music-grid">
        {musicList.map((music, index) => (
          <div
            key={index}
            className="music-option"
            onClick={() => handleSelect(music.src)}
          >
            <p>{music.label}</p>
            <audio src={music.src} controls />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicThemePage;
