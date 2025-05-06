import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const videoOptions = [
    { name: "따뜻한 영상", files: ["flower.mp4", "sunset.mp4"] },
    { name: "그리운 영상", files: ["river.mp4", "sky.mp4"] },
  ];

  const [selectedVideo, setSelectedVideo] = useState("");

  const handleSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleNext = () => {
    if (selectedVideo) {
      navigate("/music/select", { state: { backgroundType: "video", selected: selectedVideo } });
    }
  };

  const handleBack = () => {
    navigate("/style");
  };

  return (
    <div className="video-select-page">
      <h2 className="typing-text">배경으로 사용할 영상 1개를</h2>
      <div className="category-section">
        {videoOptions.map((group, index) => (
          <div key={index} className="video-category">
            <h3>{group.name}</h3>
            <div className="video-thumbnails">
              {group.files.map((video, idx) => (
                <div
                  key={idx}
                  className={`video-thumb ${selectedVideo === video ? "selected" : ""}`}
                  onClick={() => handleSelect(video)}
                >
                  <video src={`/videos/${video}`} width="100" height="80" muted preload="metadata" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="selected-preview">
        {selectedVideo && (
          <video
            src={`/videos/${selectedVideo}`}
            width="300"
            height="180"
            controls
            autoPlay
            muted
          />
        )}
      </div>
      <button className="select-button">내 파일에서 선택</button>
      <div className="button-row">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
