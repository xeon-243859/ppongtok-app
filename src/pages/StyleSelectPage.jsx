import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StyleSelectPage.css';

export default function StyleSelectPage() {
  const navigate = useNavigate();
  return (
    <div className="style-container">
      <h2>어떤 배경으로 사랑을 담아볼까요?</h2>
      <div className="button-group">
        <button onClick={() => navigate('/love/image')}>🖼️ 이미지 배경 선택</button>
        <button onClick={() => navigate('/love/video')}>🎥 영상 배경 선택</button>
      </div>
    </div>
  );
}
