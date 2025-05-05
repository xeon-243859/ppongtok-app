import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StyleSelectPage.css';
import { FaImage, FaVideo } from 'react-icons/fa';

const StyleSelectPage = () => {
  const navigate = useNavigate();

  const handleImageSelect = () => {
    navigate('/love/background-image');
  };

  const handleVideoSelect = () => {
    navigate('/love/background-video');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="question">어떤 배경으로 사랑을 담아볼까요?</div>

      <div className="selection-buttons">
        <button className="selection-button" onClick={handleImageSelect}>
          <FaImage size={24} />
          <span className="button-label">이미지 배경</span>
        </button>
        <button className="selection-button" onClick={handleVideoSelect}>
          <FaVideo size={24} />
          <span className="button-label">영상 배경</span>
        </button>
      </div>

      <button className="back-button" onClick={handleGoBack}>뒤로가기</button>
    </div>
  );
};

export default StyleSelectPage;
