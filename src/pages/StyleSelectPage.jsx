import React from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSelectPage.css";

const StyleSelectPage = () => {
  const navigate = useNavigate();

  const handleImageSelect = () => {
    navigate("/image/select");
  };

  const handleVideoSelect = () => {
    navigate("/video/select");
  };

  return (
    <div className="style-container">
      <h1 className="style-title">어떤 배경으로 사랑을 담아볼까요?</h1>
      <div className="style-buttons">
        <button className="style-button" onClick={handleImageSelect}>
          이미지 배경 선택
        </button>
        <button className="style-button" onClick={handleVideoSelect}>
          영상 배경 선택
        </button>
      </div>
    </div>
  );
};

export default StyleSelectPage;
