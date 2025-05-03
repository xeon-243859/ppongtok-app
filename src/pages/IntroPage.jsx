// src/pages/IntroPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

function IntroPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/love/form');
  };

  return (
    <div className="intro-container">
      <h1>뿅!톡에 오신 것을 환영합니다 💌</h1>
      <p>감성 메시지를 영상으로 만들어보세요</p>
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
}

export default IntroPage;
