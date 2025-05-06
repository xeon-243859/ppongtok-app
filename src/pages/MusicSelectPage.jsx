// src/pages/MusicSelectPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../MusicSelectPage.css";

const audios = [
  { src: "/audio/mueon.mp3", name: "무언1" },
  { src: "/audio/mueon1.mp3", name: "무언2" },
  { src: "/audio/spring.mp3", name: "봄의 느낌1" },
  { src: "/audio/spring1.mp3", name: "봄의 느낌2" },
];

function MusicSelectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSelect = (audio) => {
    setSelected(audio);
    localStorage.setItem("selectedMusic", audio);
  };

  const handlePreview = (src) => {
    if (preview) preview.pause();
    const audio = new Audio(src);
    audio.play();
    setPreview(audio);
  };

  const handleNext = () => {
    if (selected) navigate("/preview");
  };

  return (
    <div className="music-select-container">
      <h2 className="music-select-title">배경 음악을 선택해주세요</h2>
      <div className="music-list">
        {audios.map((audio, idx) => (
          <div
            key={idx}
            className={`music-item ${selected === audio.src ? "selected" : ""}`}
            onClick={() => handleSelect(audio.src)}
          >
            <span>{audio.name}</span>
            <button
              className="preview-button"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(audio.src);
              }}
            >
              ▶ 미리듣기
            </button>
          </div>
        ))}
      </div>
      <button className="next-button" onClick={handleNext} disabled={!selected}>
        다음으로
      </button>
    </div>
  );
}

export default MusicSelectPage;
