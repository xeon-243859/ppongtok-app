import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    const savedVideo = localStorage.getItem("selected-video");
    if (savedVideo) {
      setSelectedVideo(savedVideo);
    }
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLine1(true), 300);
    const t2 = setTimeout(() => setShowLine2(true), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleThemeSelect = () => {
    navigate("/video/theme");
  };

  const handleLocalSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedVideo(url);
    localStorage.setItem("selected-video", url);
  };

  const handleDelete = () => {
    localStorage.removeItem("selected-video");
    setSelectedVideo(null);
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
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/preview?type=video")}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
