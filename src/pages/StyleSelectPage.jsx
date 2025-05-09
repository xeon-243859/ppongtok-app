import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StyleSelectPage.css';

const StyleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="style-page-container">
      <h2 className="typing-text">어떤 배경으로 사랑을 담아볼까요?</h2>

      <div className="button-stack">
        <button className="select-button" onClick={() => navigate('/image/select')}>
          이미지 배경 선택
        </button>
        <button className="select-button" onClick={() => navigate('/video/select')}>
          영상 배경 선택
        </button>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>← 뒤로가기</button>
    </div>
  );
};

export default StyleSelectPage;
