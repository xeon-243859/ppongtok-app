// ✅ VideoSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();

  const handleClick = (slotName) => {
    localStorage.setItem("selected-slot", slotName);
    navigate("/video/theme");
  };

  const getSlotContent = (slotName) => {
    const videoSrc = localStorage.getItem(slotName);
    return videoSrc ? (
      <video src={videoSrc} controls className="slot-video" />
    ) : (
      <div className="empty-slot">+</div>
    );
  };

  return (
    <div className="video-select-container">
      <h2 className="typing-text">배경으로 사용할 영상 1개를</h2>
      <h3>선택해 주세요</h3>
      <div className="slot-grid">
        {["video-0", "video-1", "video-2", "video-3"].map((slot) => (
          <div
            key={slot}
            className="video-slot"
            onClick={() => handleClick(slot)}
          >
            {getSlotContent(slot)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSelectPage;