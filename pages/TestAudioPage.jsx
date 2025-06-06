import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/StyleSelectPage.css'; // ✅ 외부 CSS만 연결

const StyleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="select-center-box">
      <h2 className="center-title">어떤 배경으로 사랑을 담아볼까요?</h2>

      <div className="center-buttons">
        <button className="center-btn" onClick={() => navigate('/image/select')}>
          이미지 배경 선택
        </button>
        <button className="center-btn" onClick={() => navigate('/video/select')}>
          영상 배경 선택
        </button>
      </div>
    </div>
  );
};

export default StyleSelectPage;
