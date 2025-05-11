import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IntroPage.css";

function IntroPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/love/form");
  };

  return (
    <div className="intro-container">
      {/* 상단 하트 + 뿅 효과 이미지 */}
      <img
        src="/images/heart-effect.png"
        alt="하트 뿅 효과"
        className="intro-image"
      />

      {/* 텍스트 영역 */}
      <div className="intro-text">
        <p className="intro-title-line1">뿅!톡</p>
        <p className="intro-title-line2">환영합니다</p>
        <p className="intro-subtitle">따뜻한 마음을 여기에 담아주세요</p>
      </div>

      {/* 시작하기 버튼 */}
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
}

export default IntroPage;
