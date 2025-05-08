import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const videoOptions = [
  { name: "flower", src: "/videos/flower.mp4" },
  { name: "river", src: "/videos/river.mp4" },
  { name: "sky", src: "/videos/sky.mp4" },
  { name: "sunset", src: "/videos/sunset.mp4" },
];

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    localStorage.setItem("selectedVideo", JSON.stringify(video));
  };

  const handleNext = () => {
    if (selectedVideo) {
      navigate("/music/select");
    } else {
      alert("배경으로 사용할 영상을 선택해주세요.");
    }
  };

  const handleBack = () => {
    navigate("/style");
  };

  return (
    <div className="video-page-container">
      <button className="back-button" onClick={handleBack}>
        뒤로가기
      </button>
      <h1 className="video-page-title">배경으로 사용할 영상파일 1개를</h1>
      <h2 className="video-page-subtitle">선택해주세요</h2>
      <div className="video-thumbnails">
        {videoOptions.map((video, index) => (
          <div
            key={index}
            className={`thumbnail-box ${
              selectedVideo?.name === video.name ? "selected-thumbnail" : ""
            }`}
            onClick={() => handleVideoSelect(video)}
          >
            <video src={video.src} muted loop playsInline />
          </div>
        ))}
      </div>
      <button className="next-button" onClick={handleNext}>
        다음으로
      </button>
    </div>
  );
};

export default VideoSelectPage;
