import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoThemePage.css";

const videos = [
  {
    src: "/videos/flower.mp4",
    label: "따뜻한",
  },
  {
    src: "/videos/river.mp4",
    label: "낭만적인",
  },
  {
    src: "/videos/sky.mp4",
    label: "감성적인",
  },
  {
    src: "/videos/sunset.mp4",
    label: "화려한",
  },
];

const VideoThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (video) => {
    localStorage.setItem("selectedVideo", JSON.stringify(video));
    navigate("/music/select"); // 다음으로 연결
  };
  

  return (
    <div className="video-theme-container">
    <h2>동영상 테마 저장소</h2>
    <p>여기에서 따뜻한, 낭만적인, 감성적인, 화려한 영상을 선택할 수 있어요.</p>
    <div className="video-grid">
      {[
        { src: "/videos/flower.mp4", label: "따뜻한" },
        { src: "/videos/river.mp4", label: "낭만적인" },
        { src: "/videos/sky.mp4", label: "감성적인" },
        { src: "/videos/sunset.mp4", label: "화려한" }
      ].map((video, idx) => (
        <div key={idx} className="video-item" onClick={() => handleSelect(video)}>
          <video src={video.src} muted loop autoPlay />
          <span>{video.label}</span>
        </div>
      ))}
    </div>
  </div>
);
};

export default VideoThemePage;
