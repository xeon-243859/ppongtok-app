import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StyleSelectPage.css';

function StyleSelectPage() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    if (type === 'image') {
      navigate('/love/image');
    } else if (type === 'video') {
      navigate('/love/video');
    }
  };

  return (
    <div className="style-select-container">
      <h2 className="typewriter">어떤 배경으로 사랑을 담아볼까요?</h2>
      <div className="style-options">
        <div className="style-option" onClick={() => handleSelect('image')}>
          이미지 배경 선택
        </div>
        <div className="style-option" onClick={() => handleSelect('video')}>
          영상 배경 선택
        </div>
      </div>
    </div>
  );
}

export default StyleSelectPage;
