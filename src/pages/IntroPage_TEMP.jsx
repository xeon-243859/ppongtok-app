import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      <h1>💌 뿅!톡에 오신 것을 환영합니다 💌</h1>
      <button onClick={() => navigate('/love/form')}>사랑 고백 시작하기</button>
    </div>
  );
};

export default IntroPage;
