// src/pages/IntroPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🎉 뿅!톡에 오신 걸 환영합니다</h1>
      <p>사랑을 담은 메시지를 시작해볼까요?</p>
      <button onClick={() => navigate('/love/form')}>시작하기</button>
    </div>
  );
};

export default IntroPage;
