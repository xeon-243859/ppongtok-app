import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const musicOptions = [
  "/audio/mueon.mp3",
  "/audio/mueon1.mp3",
  "/audio/spring.mp3",
  "/audio/spring1.mp3",
];

function MusicSelectPage() {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const navigate = useNavigate();

  const handleSelectMusic = (music) => {
    setSelectedMusic(music);
  };

  const handleNext = () => {
    if (selectedMusic) {
      localStorage.setItem("selectedMusic", selectedMusic);
      navigate("/preview");
    } else {
      alert("음악을 선택해주세요.");
    }
  };

  const handleBack = () => {
    navigate("/image/select"); // 또는 "/video/select" → 조건부 처리도 가능
  };

  return (
    <div className="music-select-container">
      <h2 className="title">배경 음악을 선택해주세요</h2>

      <div className="music-options">
        {musicOptions.map((music, index) => (
          <div
            key={index}
            className={`music-item ${selectedMusic === music ? "selected" : ""}`}
            onClick={() => handleSelectMusic(music)}
          >
            <p>음악 {index + 1}</p>
            <audio src={music} controls />
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={handleBack} className="back">뒤로가기</button>
        <button onClick={handleNext} className="next">다음으로</button>
      </div>
    </div>
  );
}

export default MusicSelectPage;
