// src/pages/VideoSelectPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const videos = [
  { name: "flower", file: "flower.mp4", thumbnail: "flower.jpg" },
  { name: "river", file: "river.mp4", thumbnail: "river.jpg" },
  { name: "sky", file: "sky.mp4", thumbnail: "sky.jpg" },
  { name: "sunset", file: "sunset.mp4", thumbnail: "sunset.jpg" },
];

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSelect = (videoFile) => {
    setSelectedVideo(videoFile);
  };

  const handleNext = () => {
    if (selectedVideo) {
      localStorage.setItem("selectedVideo", selectedVideo);
      navigate("/preview");
    } else {
      alert("배경 영상을 선택해주세요.");
    }
  };

  return (
    <div className="video-select-container">
      <h2>배경 영상을 선택하세요</h2>
      <div className="video-thumbnails">
        {videos.map((video) => (
          <div
            key={video.name}
            className={`thumbnail-wrapper ${
              selectedVideo === video.file ? "selected" : ""
            }`}
            onClick={() => handleSelect(video.file)}
          >
            <img
              src={`/videos/${video.thumbnail}`}
              alt={video.name}
              className="thumbnail-image"
            />
            <p>{video.name}</p>
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
