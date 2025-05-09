import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const videoOptions = [
  { name: "flower", src: "/videos/flower.mp4", mood: "따뜻한, 낭만적인" },
  { name: "river", src: "/videos/river.mp4", mood: "청량한, 고요한" },
  { name: "sky", src: "/videos/sky.mp4", mood: "밝은, 희망적인" },
  { name: "sunset", src: "/videos/sunset.mp4", mood: "감성적인, 따뜻한" },
];

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSelect = (video) => {
    setSelectedVideo(video);
    localStorage.setItem("selectedVideo", JSON.stringify(video));
  };

  const handleRemove = () => {
    setSelectedVideo(null);
    localStorage.removeItem("selectedVideo");
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
      <button className="back-button" onClick={handleBack}>뒤로가기</button>
      <h1 className="video-page-title">배경으로 사용할 영상파일</h1>
      <h2 className="video-page-subtitle">1개를 선택해주세요</h2>

      <div className="video-thumbnails">
        {videoOptions.map((video, index) => (
          <div
            key={index}
            className={`thumbnail-box ${
              selectedVideo?.name === video.name ? "selected-thumbnail" : ""
            }`}
            onClick={() => handleSelect(video)}
          >
            <video src={video.src} muted loop playsInline />
            {selectedVideo?.name === video.name && (
              <>
                <div className="overlay-text">moving file</div>
                <button className="remove-button" onClick={(e) => {
                  e.stopPropagation(); // 버튼 클릭 시 썸네일 클릭 방지
                  handleRemove();
                }}>
                  X
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <button className="next-button" onClick={handleNext}>다음으로</button>
    </div>
  );
};

export default VideoSelectPage;

