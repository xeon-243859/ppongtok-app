// src/pages/IntroPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-wrapper">
      <div className="intro-container">
        <h1 className="intro-title">🎉 뿅!톡에 오신 것을 환영합니다</h1>
        <p className="intro-subtext">따뜻한 마음을 여기에 담아주세요</p>
        <button className="intro-start-button" onClick={() => navigate("/love/form")}>
          시작하기
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
