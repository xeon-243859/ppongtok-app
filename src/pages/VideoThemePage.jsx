import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoThemePage.css";

const videos = [
  { id: 1, src: "/videos/flower.mp4", label: "꽃 배경" },
  { id: 2, src: "/videos/river.mp4", label: "강물 배경" },
  { id: 3, src: "/videos/sky.mp4", label: "하늘 배경" },
  { id: 4, src: "/videos/sunset.mp4", label: "노을 배경" },
];

const VideoThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (src) => {
    localStorage.setItem("selected-video", src);
    localStorage.setItem("selected-type", "video");
    localStorage.removeItem("selected-images"); // 이미지가 있으면 충돌방지
     localStorage.setItem("video-theme-confirmed", "true"); // ✅ 새로 추가된 상태 표시
    navigate("/video/select"); // ✅ 사용자 영상 선택 후 바로 preview로 이동

  };

  return (
    <div className="video-theme-page">
      <h2 className="video-theme-title">영상 배경을 선택해주세요</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-box" onClick={() => handleSelect(video.src)}>
            <video src={video.src} muted loop playsInline className="video-thumb" />
            <p className="video-label">{video.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoThemePage;
