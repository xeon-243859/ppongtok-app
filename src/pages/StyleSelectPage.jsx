// src/pages/StyleSelectPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StyleSelectPage.css';

const StyleSelectPage = () => {
  const navigate = useNavigate();

  const handleImageSelect = () => {
    navigate('/image/select');
  };

  const handleVideoSelect = () => {
    navigate('/video/select');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="style-select-container">
      <h2 className="typing-effect">어떤 배경으로 사랑을 담아볼까요?</h2>
      <div className="button-group">
        <button className="select-button" onClick={handleImageSelect}>
          이미지 배경 선택
        </button>
        <button className="select-button" onClick={handleVideoSelect}>
          영상 배경 선택
        </button>
      </div>
      <button className="back-button" onClick={handleBack}>← 뒤로가기</button>
    </div>
  );
};

export default StyleSelectPage;
