// src/pages/IntroPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      <h1>뿅!톡에 오신 것을 환영합니다 💌</h1>
      <p>사랑의 메시지를 감성 영상으로 만들어보세요</p>
      <button className="start-button" onClick={() => navigate('/love/form')}>
        시작하기
      </button>
    </div>
  );
};

export default IntroPage;
