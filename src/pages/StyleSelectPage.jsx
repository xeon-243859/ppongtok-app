import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StyleSelectPage.css';

function StyleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="style-select-container">
      <h2 className="typing-text">어떤 배경으로 사랑을 담아볼까요?</h2>

      <div className="style-button-group">
        <button className="style-button" onClick={() => navigate('/image/select')}>
          이미지 배경 선택
        </button>
        <button className="style-button" onClick={() => navigate('/video/select')}>
          영상 배경 선택
        </button>
      </div>
    </div>
  );
}

export default StyleSelectPage;
