import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const videoOptions = [
    { id: "vid-01", src: "flower.mp4" },
    { id: "vid-02", src: "sunset.mp4" },
    { id: "vid-03", src: "river.mp4" },
    { id: "vid-04", src: "sky.mp4" },
  ];

  const [selectedVideo, setSelectedVideo] = useState("");

  const handleSelect = (videoId) => {
    setSelectedVideo(videoId);
  };

  const handleNext = () => {
    if (selectedVideo) {
      navigate("/music/select", {
        state: { backgroundType: "video", selected: selectedVideo },
      });
    }
  };

  const handleBack = () => {
    navigate("/style");
  };

  return (
    <div className="video-select-page">
      <h2 className="typing-text">배경으로 사용할 영상 1개를 선택해 주세요</h2>
      <div className="slot-grid">
        {videoOptions.map((video) => (
          <div
            key={video.id}
            className={`slot ${selectedVideo === video.id ? "selected" : ""}`}
            onClick={() => handleSelect(video.id)}
          >
            <video
              src={`/videos/${video.src}`}
              width="80"
              height="60"
              muted
              preload="metadata"
            />
            <div className="slot-label">{video.id}</div>
          </div>
        ))}
      </div>
      <div className="selected-slot">
        {selectedVideo ? (
          <video
            src={`/videos/${videoOptions.find(v => v.id === selectedVideo).src}`}
            width="240"
            height="140"
            controls
            autoPlay
            muted
          />
        ) : (
          <div className="empty-slot">선택된 영상이 여기에 표시됩니다</div>
        )}
      </div>
      <div className="button-row">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
