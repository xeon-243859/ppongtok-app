// src/pages/VideoSelectPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = ["flower.mp4", "river.mp4", "sky.mp4", "sunset.mp4"];

  const handleSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleNext = () => {
    if (selectedVideo) {
      navigate("/preview");
    } else {
      alert("배경 영상을 선택해주세요.");
    }
  };

  return (
    <div className="video-select-wrapper">
      <h2 className="title">네번째 화면 · 영상 배경화면 선택</h2>

      <div className="video-grid">
        {videos.map((video) => (
          <video
            key={video}
            src={`/videos/${video}`}
            className={selectedVideo === video ? "selected" : ""}
            onClick={() => handleSelect(video)}
            width="160"
            height="90"
            muted
            loop
            preload="metadata" // ✅ autoPlay 제거, preload 추가
          />
        ))}
      </div>

      <div className="nav-buttons">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
