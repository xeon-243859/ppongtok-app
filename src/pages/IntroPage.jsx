import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/love/form");
  };

  return (
    <div className="intro-container">
      <h1 className="intro-title">💌 뿅!톡에 오신 걸 환영해요!</h1>
      <p className="intro-description">사랑 고백, 진심을 담아 전해볼까요?</p>
      <button className="start-button" onClick={handleStartClick}>
        시작하기
      </button>
    </div>
  );
};

export default IntroPage;
