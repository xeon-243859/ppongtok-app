// ✅ VideoThemePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoThemePage.css";

const videos = [
  { src: "/videos/flower.mp4", label: "따뜻한" },
  { src: "/videos/river.mp4", label: "낭만적인" },
  { src: "/videos/sky.mp4", label: "감성적인" },
  { src: "/videos/sunset.mp4", label: "화려한" },
];

const VideoThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (videoPath) => {
    const slot = localStorage.getItem("selected-slot");
    if (!slot) {
      alert("저장할 슬롯이 설정되지 않았습니다.");
      return;
    }

    localStorage.setItem(slot, videoPath);
    localStorage.removeItem("selected-slot");
    navigate("/video/select");
  };

  return (
    <div className="video-theme-container">
      <h2>영상 테마 저장소</h2>
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-option" onClick={() => handleSelect(video.src)}>
            <video src={video.src} muted loop playsInline />
            <p>{video.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoThemePage;
