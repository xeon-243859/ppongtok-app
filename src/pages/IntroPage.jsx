import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css"; 

function IntroPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/select-category");
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
        <p className="philosophy-quote">
            추억을 만들며 사랑을 고백하고,<br/>
            축하하고, 또 잘못한 일은 사과하고,<br/>
            감사하며 사는 인생.
       </p>

      </div>

      {/* 시작하기 버튼 */}
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
      <p className="app-slogan">for love, for courage, for memories.</p>
      <p className="app-credit">by boribori & Xeon</p>
    </div>
  );
}

export default IntroPage;


