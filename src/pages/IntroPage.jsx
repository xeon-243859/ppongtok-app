import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

export default function IntroPage() {
  const navigate = useNavigate();
  return (
    <div className="intro-container">
      <h1>❤️ 뿅!톡에 오신 것을</h1>
      <h2>환영합니다.</h2>
      <p>따뜻한 마음을 여기에 담아주세요.</p>
      <button onClick={() => navigate('/love/form')}>시작하기</button>
    </div>
  );
}
