// ✅ StyleSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSelectPage.css";

const StyleSelectPage = () => {
  const navigate = useNavigate();

  const handleImage = () => {
    localStorage.setItem("bgType", "image");
    navigate("/image/theme");
  };

  const handleVideo = () => {
    localStorage.setItem("bgType", "video");
    navigate("/video/entry");
  };

  return (
    <div className="style-select-container">
      <h1 className="style-title">어떤 배경을 사용할까요?</h1>
      <div className="style-button-group">
        <button className="style-button" onClick={handleImage}>
          이미지 배경 선택
        </button>
        <button className="style-button" onClick={handleVideo}>
          영상 배경 선택
        </button>
      </div>
    </div>
  );
};

export default StyleSelectPage;
