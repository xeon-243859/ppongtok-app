// src/pages/MusicSelectPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const musicList = [
  "/audio/mueon.mp3",
  "/audio/mueon1.mp3",
  "/audio/spring.mp3",
  "/audio/spring1.mp3"
];

function MusicSelectPage({ setSelectedMusic }) {
  const navigate = useNavigate();
  const [previewMusic, setPreviewMusic] = useState("");

  const handleSelect = (music) => {
    setSelectedMusic(music);
    setPreviewMusic(music);
  };

  return (
    <div className="music-select-container">
      <h2>배경 음악을 선택해 주세요</h2>
      <div className="music-buttons">
        {musicList.map((music, index) => (
          <button
            key={index}
            onClick={() => handleSelect(music)}
          >
            {`음악 ${index + 1}`}
          </button>
        ))}
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const musicUrl = URL.createObjectURL(file);
              setSelectedMusic(musicUrl);
              setPreviewMusic(musicUrl);
            }
          }}
        />
      </div>
      {previewMusic && (
        <div className="music-preview">
          <audio src={previewMusic} controls autoPlay />
        </div>
      )}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/style/select")}>뒤로가기</button>
        <button onClick={() => navigate("/love/generate")}>다음으로</button>
      </div>
    </div>
  );
}

export default MusicSelectPage;
