import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StyleSelectPage.css';

function StyleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="love-select-wrapper">
      <h2 className="love-title">어떤 배경으로 사랑을 담아볼까요?</h2>

      <div className="love-button-group">
        <button className="love-button" onClick={() => navigate('/image/select')}>
          이미지 배경 선택
        </button>
        <button className="love-button" onClick={() => navigate('/video/select')}>
          영상 배경 선택
        </button>
      </div>
    </div>
  );
}

export default StyleSelectPage;
