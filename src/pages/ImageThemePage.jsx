import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageThemePage.css';

const themes = {
  '따뜻한': [
    { src: '/backgrounds/cosmos.jpg', label: '따뜻한1' },
    { src: '/backgrounds/leaves.jpg', label: '따뜻한2' }
  ],
  '낭만적인': [
    { src: '/backgrounds/road.jpg', label: '낭만적인1' }
  ],
  '화려한': [
    { src: '/backgrounds/water.jpg', label: '화려한1' }
  ],
  '감성적인': [
    { src: '/backgrounds/sky.jpg', label: '감성적인1' }
  ]
};

const ImageThemePage = () => {
  const navigate = useNavigate();

  const handleImageSelect = (img) => {
    const stored = JSON.parse(localStorage.getItem('selectedImages')) || [null, null, null, null];
    const emptyIndex = stored.findIndex(item => item === null);
    if (emptyIndex !== -1) {
      stored[emptyIndex] = img;
      localStorage.setItem('selectedImages', JSON.stringify(stored));
    }
    navigate('/image/select');
  };

  return (
    <div className="theme-page-container">
      <h2 className="theme-page-title">우리 앱 저장소에서 이미지를 선택해주세요</h2>
      {Object.entries(themes).map(([theme, images]) => (
        <div key={theme} className="theme-section">
          <h3 className="theme-label">{theme}</h3>
          <div className="theme-image-list">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={img.label}
                className="theme-thumbnail"
                onClick={() => handleImageSelect(img)}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="theme-footer">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};

export default ImageThemePage;

