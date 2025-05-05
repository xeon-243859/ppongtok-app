// src/pages/StyleSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSelectPage.css";

const StyleSelectPage = () => {
  const navigate = useNavigate();

  const goToImageSelect = () => {
    navigate("/select/image");
  };

  const goToVideoSelect = () => {
    navigate("/select/video");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="style-select-wrapper">
      <div className="style-select-container">
        <h2 className="title-text">
          어떤 배경으로<br />사랑을 담아볼까요?
        </h2>
        <div className="select-buttons">
          <button onClick={goToImageSelect}>🖼 이미지 배경</button>
          <button onClick={goToVideoSelect}>🎞 영상 배경</button>
        </div>
        <button className="back-button" onClick={goBack}>뒤로가기</button>
      </div>
    </div>
  );
};

export default StyleSelectPage;
