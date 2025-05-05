import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState("/backgrounds/cosmos.jpg");
  const [selectedMusic, setSelectedMusic] = useState("/audio/mueon.mp3");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMusic(url);
    }
  };

  const handleNext = () => {
    localStorage.setItem("selectedImage", selectedImage);
    localStorage.setItem("selectedMusic", selectedMusic);
    navigate("/love/preview");
  };

  return (
    <div className="image-select-wrapper">
      <h2 className="title">이미지 배경을 선택하세요</h2>
      <div className="image-options">
        {["cosmos.jpg", "leaves.jpg", "road.jpg", "water.jpg"].map((img, i) => (
          <img
            key={i}
            src={`/backgrounds/${img}`}
            alt={`bg-${i}`}
            className={`thumbnail ${selectedImage.includes(img) ? "selected" : ""}`}
            onClick={() => setSelectedImage(`/backgrounds/${img}`)}
          />
        ))}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <h2 className="title">배경 음악을 선택하세요</h2>
      <div className="music-options">
        {["mueon.mp3", "mueon1.mp3", "spring.mp3", "spring1.mp3"].map((track, i) => (
          <button
            key={i}
            className={selectedMusic.includes(track) ? "selected-music" : ""}
            onClick={() => setSelectedMusic(`/audio/${track}`)}
          >
            🎵 {track.replace(".mp3", "")}
          </button>
        ))}
        <input type="file" accept="audio/*" onChange={handleMusicUpload} />
      </div>

      <audio src={selectedMusic} autoPlay loop />

      <div className="button-group">
        <button onClick={() => navigate("/love/style")}>🔙 뒤로가기</button>
        <button onClick={handleNext}>➡️ 다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
