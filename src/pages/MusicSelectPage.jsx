// src/pages/MusicSelectPage.jsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MusicSelectPage.css";

const audioList = [
  "mueon.mp3",
  "mueon1.mp3",
  "spring.mp3",
  "spring1.mp3",
];

const MusicSelectPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const audioRef = useRef(null);

  const handleSelect = (music) => {
    setSelected(music);
    localStorage.setItem("selectedMusic", music);
  };

  const playMusic = (music) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const newAudio = new Audio(`/audio/${music}`);
    audioRef.current = newAudio;
    newAudio.play();
  };

  const goNext = () => {
    if (!selected) {
      alert("음악을 선택해주세요!");
      return;
    }
    navigate("/preview");
  };

  return (
    <div className="music-select-wrapper">
      <h2 className="music-title">분위기에 어울리는 음악을 선택해주세요</h2>

      <div className="music-list">
        {audioList.map((music) => (
          <div
            key={music}
            className={`music-item ${selected === music ? "selected" : ""}`}
            onClick={() => handleSelect(music)}
          >
            🎵 {music.replace(".mp3", "")}
            <button
              className="play-button"
              onClick={(e) => {
                e.stopPropagation();
                playMusic(music);
              }}
            >
              ▶ 미리듣기
            </button>
          </div>
        ))}
      </div>

      <div className="music-buttons">
        <button onClick={() => navigate(-1)}>← 뒤로가기</button>
        <button onClick={goNext}>다음으로</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
