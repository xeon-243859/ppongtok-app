import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const videos = [
  "/videos/flower.mp4",
  "/videos/river.mp4",
  "/videos/sky.mp4",
  "/videos/sunset.mp4",
];

function VideoSelectPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleNext = () => {
    if (selectedVideo) {
      localStorage.setItem("selectedVideo", selectedVideo);
      navigate("/music/select");
    } else {
      alert("하나의 영상을 선택해주세요.");
    }
  };

  const handleBack = () => {
    navigate("/love/style");
  };

  return (
    <div className="video-select-container">
      <h2 className="title">배경으로 사용할 영상을 선택해주세요</h2>

      <div className="video-grid">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`video-thumbnail ${selectedVideo === video ? "selected" : ""}`}
            onClick={() => handleSelectVideo(video)}
          >
            <video src={video} width="100%" muted />
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={handleBack} className="back">뒤로가기</button>
        <button onClick={handleNext} className="next">다음으로</button>
      </div>
    </div>
  );
}

export default VideoSelectPage;
