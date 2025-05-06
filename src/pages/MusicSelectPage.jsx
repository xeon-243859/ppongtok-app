import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MusicSelectPage.css";

const MusicSelectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const musicFiles = ["mueon.mp3", "mueon1.mp3", "spring.mp3", "spring1.mp3"];

  const [selectedMusic, setSelectedMusic] = useState("");

  const handleSelect = (music) => {
    setSelectedMusic(music);
  };

  const handleNext = () => {
    if (selectedMusic) {
      navigate("/preview", {
        state: {
          ...location.state,
          music: selectedMusic,
        },
      });
    }
  };

  const handleBack = () => {
    if (location.state?.backgroundType === "image") {
      navigate("/image/select");
    } else {
      navigate("/video/select");
    }
  };

  return (
    <div className="music-select-page">
      <h2 className="typing-text">배경 음악을 선택해 주세요</h2>
      <div className="music-list">
        {musicFiles.map((music, index) => (
          <div
            key={index}
            className={`music-item ${selectedMusic === music ? "selected" : ""}`}
            onClick={() => handleSelect(music)}
          >
            <p>{music.replace(".mp3", "")}</p>
            <audio src={`/audio/${music}`} controls preload="metadata" />
          </div>
        ))}
      </div>
      <div className="button-row">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
