// src/pages/LoveFinalPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoveFinalPage.css"; // 필요 시 스타일링

const LoveFinalPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="final-page-container">
      <h1>💕 사랑의 메시지가 완성되었습니다! 💕</h1>
      <p>
        당신의 마음이 전해졌어요.
        <br />
        따뜻한 사랑이 누군가의 하루를 밝혀줄 거예요.
      </p>
      <button className="go-home-button" onClick={handleGoHome}>
        처음으로
      </button>
    </div>
  );
};

export default LoveFinalPage;
