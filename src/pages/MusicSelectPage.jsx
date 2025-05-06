import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MusicSelectPage.css";

const musicList = [
  { name: "무언1", file: "/audio/mueon.mp3" },
  { name: "무언2", file: "/audio/mueon1.mp3" },
  { name: "봄날1", file: "/audio/spring.mp3" },
  { name: "봄날2", file: "/audio/spring1.mp3" }
];

export default function MusicSelectPage() {
  const [selectedMusic, setSelectedMusic] = useState("");
  const [audioPreview, setAudioPreview] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const handleMusicClick = (musicFile) => {
    setSelectedMusic(musicFile);
    if (audioPreview) audioPreview.pause();

    const audio = new Audio(musicFile);
    audio.play();
    setAudioPreview(audio);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setSelectedMusic(fileURL);
      if (audioPreview) audioPreview.pause();
      const audio = new Audio(fileURL);
      audio.play();
      setAudioPreview(audio);
    }
  };

  const handleNext = () => {
    if (!selectedMusic) {
      alert("배경 음악을 선택해주세요.");
      return;
    }

    navigate("/preview", {
      state: {
        ...prevData,
        backgroundMusic: selectedMusic
      }
    });
  };

  return (
    <div className="music-select-container">
      <h2 className="title-text">배경 음악을 선택해주세요</h2>

      <div className="music-list">
        {musicList.map((item, idx) => (
          <button
            key={idx}
            className={`music-button ${selectedMusic === item.file ? "selected" : ""}`}
            onClick={() => handleMusicClick(item.file)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="upload-section">
        <label className="upload-button">
          내 파일에서 선택
          <input type="file" accept="audio/*" onChange={handleFileUpload} hidden />
        </label>
      </div>

      <div className="button-group">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}
