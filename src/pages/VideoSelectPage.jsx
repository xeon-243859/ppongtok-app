import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";
import { Typewriter } from "react-simple-typewriter";

const videoThumbnails = [
  { thumb: "/videos/flower.jpg", video: "/videos/flower.mp4" },
  { thumb: "/videos/river.jpg", video: "/videos/river.mp4" },
  { thumb: "/videos/sky.jpg", video: "/videos/sky.mp4" },
  { thumb: "/videos/sunset.jpg", video: "/videos/sunset.mp4" }
];

export default function VideoSelectPage() {
  const [selectedVideo, setSelectedVideo] = useState("");
  const [previewThumb, setPreviewThumb] = useState("");
  const navigate = useNavigate();

  const handleVideoClick = (video, thumb) => {
    setSelectedVideo(video);
    setPreviewThumb(thumb);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setSelectedVideo(videoURL);
      setPreviewThumb(""); // 업로드 영상에는 썸네일이 없을 수 있음
    }
  };

  const handleNext = () => {
    if (!selectedVideo) {
      alert("배경 영상을 선택해주세요.");
      return;
    }
    navigate("/music/select", { state: { backgroundVideo: selectedVideo } });
  };

  return (
    <div className="video-select-container">
      <div className="title-text">
        <span>
          <Typewriter
            words={["배경으로 사용할 영상 1개를", "선택해주세요"]}
            loop={1}
            cursor
            typeSpeed={50}
            deleteSpeed={0}
            delaySpeed={1000}
          />
        </span>
      </div>

      <div className="video-thumbnails">
        {videoThumbnails.map((item, idx) => (
          <img
            key={idx}
            src={item.thumb}
            alt={`video-${idx}`}
            className={`thumbnail ${selectedVideo === item.video ? "selected" : ""}`}
            onClick={() => handleVideoClick(item.video, item.thumb)}
          />
        ))}
      </div>

      <div className="preview-slot">
        {previewThumb ? (
          <img src={previewThumb} alt="선택된 썸네일" className="preview-img" />
        ) : selectedVideo ? (
          <video src={selectedVideo} controls className="preview-img" />
        ) : (
          <div className="empty-slot">video-0 (선택된 영상 미리보기)</div>
        )}
      </div>

      <div className="upload-section">
        <label className="upload-button">
          내 파일에서 선택
          <input type="file" accept="video/*" onChange={handleFileUpload} hidden />
        </label>
      </div>

      <div className="button-group">
        <button onClick={() => navigate("/style")}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}
