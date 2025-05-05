// src/pages/ImageBackgroundPage.jsx
import React from "react";
import "./ImageBackgroundPage.css";
import { useNavigate } from "react-router-dom";

const ImageBackgroundPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/music");
  };

  const handleBack = () => {
    navigate("/style/select");
  };

  return (
    <div className="background-container">
      <h2>이미지 배경을 선택하세요</h2>
      <div className="theme-buttons">
        <button className="theme-button">따뜻한</button>
        <button className="theme-button">설레임</button>
        <button className="theme-button">그리움</button>
        <button className="theme-button">감성적인</button>
        <input type="file" accept="image/*" className="file-input" />
      </div>
      <div className="image-preview-row">
        <div className="image-preview">1</div>
        <div className="image-preview">2</div>
        <div className="image-preview">3</div>
        <div className="image-preview">4</div>
      </div>
      <div className="nav-buttons">
        <button className="back-button" onClick={handleBack}>뒤로가기</button>
        <button className="next-button" onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageBackgroundPage;
