// ✅ VideoSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const selected = localStorage.getItem("video-0");

  const handleSelect = () => {
    localStorage.setItem("selected-slot", "video-0");
    navigate("/video/theme");
  };

  const handleRemove = () => {
    localStorage.removeItem("video-0");
    navigate(0);
  };

  const handleNext = () => {
    if (!selected) {
      alert("영상을 선택해주세요");
      return;
    }
    navigate("/music/select");
  };

  return (
    <div className="video-select-container">
      <h2 className="video-title">배경으로 사용할 영상파일</h2>
      <h3 className="video-subtitle">1개를 선택해주세요</h3>

      {/* 선택된 영상이 있을 경우에만 표시 */}
      {selected && (
        <div className="selected-video-box center-on-mobile">
          <video src={selected} controls className="video-preview" />
          <div className="overlay-text">moving file</div>
          <button className="remove-button" onClick={handleRemove}>X</button>
        </div>
      )}

      {/* 영상 파일 선택 버튼 */}
      {!selected && (
        <div className="video-button-row">
          <button className="file-select-button" onClick={handleSelect}>동영상파일</button>
          <button className="file-select-button" onClick={() => alert("내파일선택은 추후 구현")}>내파일선택</button>
        </div>
      )}

      <div className="video-button-group">
        <button className="back-button" onClick={() => navigate("/style/select")}>뒤로가기</button>
        <button className="next-button" onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
