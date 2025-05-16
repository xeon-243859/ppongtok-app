import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoName, setVideoName] = useState("");

  const handleThemeSelect = () => {
    // 기존 동영상 테마 파일 선택 버튼 (테마 목록 아래로 이동)
  };

  const handleLocalSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const videoUrl = URL.createObjectURL(file);
    setSelectedVideo(videoUrl);
    setVideoName(file.name);
    localStorage.setItem("selected-video", videoUrl);
  };

  const handleVideoSelect = (url) => {
    setSelectedVideo(url);
    setVideoName(url.split("/").pop());
    localStorage.setItem("selected-video", url);
    navigate("/music/select");
  };

  const handleBack = () => {
    navigate("/style/select");
  };

  const handleNext = () => {
    navigate("/music/select");
  };

  return (
    <div className="video-select-page">
      <h2 className="video-select-title">
        배경으로 사용할 영상을<br />선택해주세요
      </h2>

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

      {/* 🎞 테마 영상 UI */}
      <div className="theme-video-options">
        <div className="video-option" onClick={() => handleVideoSelect("/video/spring1.mp4")}> 
          <video src="/video/spring1.mp4" muted loop />
          <p>봄 영상</p>
        </div>
        <div className="video-option" onClick={() => handleVideoSelect("/video/night1.mp4")}> 
          <video src="/video/night1.mp4" muted loop />
          <p>밤 영상</p>
        </div>
      </div>

      {selectedVideo && (
        <div className="video-preview-box">
          <p className="video-label">{videoName || "선택된 영상 없음"}</p>
          <video src={selectedVideo} controls autoPlay muted loop />
        </div>
      )}

      <div className="button-group horizontal">
        <button className="back-button" onClick={handleBack}>뒤로가기</button>
        <button className="next-button" onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
