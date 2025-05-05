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
      <h1 className="slide-down">❤️ 뿅!톡에 오신 것을</h1>
      <h2 className="slide-right">환영합니다.</h2>
      <p className="typewriter">따뜻한 마음을 여기에 담아주세요.</p>
      <button onClick={handleStart}>시작하기</button>
    </div>
  );
}

export default IntroPage;
