import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoBackgroundPage.css";

const videoList = [
  "/videos/flower.mp4",
  "/videos/river.mp4",
  "/videos/sky.mp4",
  "/videos/sunset.mp4"
];

function VideoBackgroundPage({ setSelectedVideo }) {
  const navigate = useNavigate();
  const [previewVideo, setPreviewVideo] = useState("");

  const handleSelect = (video) => {
    setSelectedVideo(video);
    setPreviewVideo(video);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      setPreviewVideo(videoUrl);
    }
  };

  return (
    <div className="video-background-container">
      <h2>어떤 영상 배경을 선택하시겠어요?</h2>
      <div className="background-options">
        {videoList.map((video, index) => (
          <button key={index} onClick={() => handleSelect(video)}>
            {["꽃", "강물", "하늘", "노을"][index]}
          </button>
        ))}
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </div>
      {previewVideo && (
        <div className="video-preview">
          <video src={previewVideo} controls width="500" />
        </div>
      )}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/style/select")}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
}

export default VideoBackgroundPage;
