import React from "react";
import { useNavigate } from "react-router-dom";
import "./MusicThemePage.css";

const musicList = [
  { id: "music01", src: "/audio/spring.mp3", name: "봄의노래" },
  { id: "music02", src: "/audio/spring1.mp3", name: "설레임" },
  { id: "music03", src: "/audio/mueon.mp3", name: "무언의 감정" },
  { id: "music04", src: "/audio/mueon1.mp3", name: "고요한 바람" },
];

const MusicThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (src, name) => {
    localStorage.setItem("selected-music", src);
    localStorage.setItem("selected-music-name", name);
    navigate("/music/select");
  };

  return (
    <div className="music-theme-container">
      <h2 className="music-theme-title">음원 테마 저장소</h2>

      <div className="music-theme-list">
        {musicList.map((music) => (
          <div
            key={music.id}
            className="music-item"
            onClick={() => handleSelect(music.src, music.name)}
          >
            <p>{music.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicThemePage;
