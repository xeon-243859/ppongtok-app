import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const videos = [
  { id: "vid-01", src: "/videos/flower.mp4", label: "flower" },
  { id: "vid-02", src: "/videos/river.mp4", label: "river" },
  { id: "vid-03", src: "/videos/sky.mp4", label: "sky" },
  { id: "vid-04", src: "/videos/sunset.mp4", label: "sunset" },
];

function VideoSelectPage() {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");

  // 타자 효과 구현
  useEffect(() => {
    const line1 = "배경으로 사용할 영상 1개를";
    const line2 = "선택해주세요";
    let idx1 = 0;
    let idx2 = 0;

    const typing1 = setInterval(() => {
      if (idx1 < line1.length) {
        setTypedLine1((prev) => prev + line1[idx1]);
        idx1++;
      } else {
        clearInterval(typing1);
        const typing2 = setInterval(() => {
          if (idx2 < line2.length) {
            setTypedLine2((prev) => prev + line2[idx2]);
            idx2++;
          } else {
            clearInterval(typing2);
          }
        }, 50);
      }
    }, 50);
  }, []);

  const handleSelect = (videoSrc) => {
    setSelectedVideo(videoSrc);
    localStorage.setItem("selectedVideo", videoSrc);
    localStorage.removeItem("selectedBackground"); // 이미지 선택 제거
  };

  const handleNext = () => {
    if (selectedVideo) {
      navigate("/music/select");
    } else {
      alert("영상을 선택해주세요!");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="video-select-container">
      <div className="video-title">
        <div>{typedLine1}</div>
        <div>{typedLine2}</div>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <video
            key={video.id}
            src={video.src}
            className={`video-thumbnail ${selectedVideo === video.src ? "selected" : ""}`}
            onClick={() => handleSelect(video.src)}
            muted
            loop
            playsInline
          />
        ))}
      </div>

      {selectedVideo && (
        <div className="selected-video-preview">
          <video src={selectedVideo} autoPlay loop muted playsInline />
        </div>
      )}

      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}

export default VideoSelectPage;
