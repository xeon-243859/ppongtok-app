import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const musicList = [
  { name: "잔잔한 뮤온", file: "/audio/mueon.mp3" },
  { name: "따뜻한 뮤온", file: "/audio/mueon1.mp3" },
  { name: "봄 느낌", file: "/audio/spring.mp3" },
  { name: "산들바람", file: "/audio/spring1.mp3" },
];

function MusicSelectPage() {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (file) => {
    setSelectedMusic(file);
    localStorage.setItem("selectedMusic", file);
  };

  const handleNext = () => {
    if (selectedMusic) {
      navigate("/preview");
    } else {
      alert("배경음악을 선택해주세요!");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="music-container">
      <h2 className="typewriter">배경음악을 선택해주세요</h2>
      <div className="music-grid">
        {musicList.map((music, idx) => (
          <div
            key={idx}
            className={`music-card ${
              selectedMusic === music.file ? "selected" : ""
            }`}
            onClick={() => handleSelect(music.file)}
          >
            <p>{music.name}</p>
            <audio controls src={music.file}></audio>
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="back-button" onClick={handleBack}>
          뒤로가기
        </button>
        <button className="next-button" onClick={handleNext}>
          다음으로
        </button>
      </div>
    </div>
  );
}

export default MusicSelectPage;
