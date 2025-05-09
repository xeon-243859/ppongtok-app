import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/video/entry");
  };

  return (
    <div className="intro-container">
      <h1 className="intro-title">✨ 뿅!톡에 오신 걸 환영합니다 ✨</h1>
      <p className="intro-subtitle">감성을 담은 메시지를 만들어보세요</p>
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
};

export default IntroPage;
