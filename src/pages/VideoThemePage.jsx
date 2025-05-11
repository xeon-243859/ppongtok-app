import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoThemePage.css";

const videoList = [
  { id: "video01", src: "/videos/flower.mp4", name: "꽃잎" },
  { id: "video02", src: "/videos/river.mp4", name: "강물" },
  { id: "video03", src: "/videos/sky.mp4", name: "하늘" },
  { id: "video04", src: "/videos/sunset.mp4", name: "노을" },
];

const VideoThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (src) => {
    localStorage.setItem("selected-video", src); // ✅ 슬롯 없이 저장
    navigate("/video/select"); // ✅ 선택 후 다음 화면으로
  };

  return (
    <div className="video-theme-container">
      <h2 className="video-theme-title">영상 테마 저장소</h2>

      <div className="video-theme-list">
        {videoList.map((video) => (
          <div
            key={video.id}
            className="video-item"
            onClick={() => handleSelect(video.src)}
          >
            <p>{video.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoThemePage;
