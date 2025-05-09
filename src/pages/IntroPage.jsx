import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    console.log("✅ 버튼 클릭됨"); // ✅ 이 줄이 테스트용
    navigate("/love/form");  // 메시지 입력 페이지로 이동
  };

  return (
    <div className="intro-container">
      <div className="intro-text">
        <h1 className="intro-title">✨ 뿅!톡에 오신 걸 환영합니다 ✨</h1>
        <p className="intro-subtitle">사랑을 전할 메시지를 만들어보세요</p>
      </div>
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
};

export default IntroPage;
