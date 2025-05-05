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
      <h1 className="typewriter">당신의 마음을 전해보세요 💖</h1>
      <button className="start-button" onClick={handleStart}>시작하기</button>
    </div>
  );
}

export default IntroPage;
