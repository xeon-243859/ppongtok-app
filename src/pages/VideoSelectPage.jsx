// src/pages/VideoSelectPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../VideoSelectPage.css";

const videos = [
  { src: "/videos/flower.mp4", thumbnail: "/videos/flower.jpg" },
  { src: "/videos/river.mp4", thumbnail: "/videos/river.jpg" },
  { src: "/videos/sky.mp4", thumbnail: "/videos/sky.jpg" },
  { src: "/videos/sunset.mp4", thumbnail: "/videos/sunset.jpg" },
];

function VideoSelectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (video) => {
    setSelected(video);
  };

  const handleNext = () => {
    if (selected) {
      localStorage.setItem("selectedVideo", selected);
      navigate("/music/select");
    }
  };

  return (
    <div className="video-select-container">
      <h2 className="video-select-title">배경으로 사용할 영상을 선택해주세요</h2>
      <div className="video-grid">
        {videos.map((video, idx) => (
          <img
            key={idx}
            src={video.thumbnail}
            alt={`video-${idx}`}
            className={`video-thumb ${selected === video.src ? "selected" : ""}`}
            onClick={() => handleSelect(video.src)}
          />
        ))}
      </div>
      <div className="video-buttons">
        <button className="back-button" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
        <button className="next-button" onClick={handleNext} disabled={!selected}>
          다음으로
        </button>
      </div>
    </div>
  );
}

export default VideoSelectPage;
