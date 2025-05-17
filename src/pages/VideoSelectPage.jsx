import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showLine1, setShowLine1] = useState(true);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine2(true), 1500);
    return () => clearTimeout(timer1);
  }, []);

  // ✅ 불필요한 음악선택 자동 이동 방지
  useEffect(() => {
    const hasMusic = localStorage.getItem("selected-music");
    const hasVideo = localStorage.getItem("selected-video");

    if (hasVideo && !hasMusic) {
      console.log("🛑 자동 음악선택 이동 방지: 음악 선택 전 상태입니다.");
    }
  }, []);

  const handleThemeSelect = () => {
    navigate("/video/theme");
  };

  const handleLocalSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      localStorage.setItem("selected-video", videoUrl);
    }
  };

  const handleDelete = () => {
    setSelectedVideo(null);
    localStorage.removeItem("selected-video");
  };

  return (
    <div className="video-select-container">
      {showLine1 && <h2 className="video-title-line1">배경으로 사용할 영상파일 1개를</h2>}
      {showLine2 && <h2 className="video-title-line2">선택해 주세요</h2>}

      <div className="video-button-group">
        <button onClick={handleThemeSelect}>동영상파일</button>
        <button onClick={handleLocalSelect}>내파일선택</button>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="moving-box">
        {selectedVideo ? (
          <>
            <video src={selectedVideo} autoPlay loop muted />
            <button className="delete-button" onClick={handleDelete}>X</button>
          </>
        ) : (
          <p className="moving-placeholder">moving file</p>
        )}
      </div>

      <div className="video-button-nav">
        <button onClick={() => navigate("/style/select", { replace: true })}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
