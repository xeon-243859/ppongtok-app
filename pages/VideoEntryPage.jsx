import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoEntryPage.css";

const VideoEntryPage = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 영상 선택된 상태 불러오기 (자동 이동 ❌)
  useEffect(() => {
    const stored = localStorage.getItem("selectedVideo");
    if (stored) {
      setSelectedVideo(JSON.parse(stored));
    }
  }, []);

  const handleRemove = () => {
    setSelectedVideo(null);
    localStorage.removeItem("selectedVideo");
  };

  return (
    <div className="entry-page-container">
      <div className="entry-text-block">
        <h1 className="entry-title">배경으로 사용할 영상파일 1개를</h1>
        <h2 className="entry-subtitle">선택해주세요</h2>
      </div>

      <div className="entry-button-group">
        <button className="entry-button" onClick={() => navigate("/video/select")}>
          동영상파일
        </button>
        <button className="entry-button" onClick={() => navigate("/video/upload")}>
          내파일선택
        </button>
      </div>

      {selectedVideo && (
        <div className="selected-video-box">
          <video src={selectedVideo.src} controls width="100%" height="100%" />
          <div className="moving-label">moving file</div>
          <button className="remove-button" onClick={handleRemove}>X</button>
        </div>
      )}

      <div className="nav-button-group">
        <button className="nav-button" onClick={() => navigate(-1)}>뒤로가기</button>
        <button className="nav-button" onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoEntryPage;
