// File: ImageThemePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageThemePage.css';

const themes = {
  따뜻한: [
    { src: '/backgrounds/cosmos.jpg', label: '따뜻한1' },
    { src: '/backgrounds/leaves.jpg', label: '따뜻한2' },
  ],
  낭만적인: [
    { src: '/backgrounds/road.jpg', label: '낭만적인1' },
    { src: '/backgrounds/water.jpg', label: '낭만적인2' },
  ],
};

const ImageThemePage = () => {
  const navigate = useNavigate();

  const handleThemeSelect = (image) => {
    const selected = JSON.parse(localStorage.getItem('selectedImages')) || [null, null, null, null];
    const emptyIndex = selected.findIndex((img) => img === null);
    if (emptyIndex !== -1) {
      selected[emptyIndex] = image;
      localStorage.setItem('selectedImages', JSON.stringify(selected));
    }
    navigate('/image/select');
  };

  return (
    <div className="image-theme-container">
      <h2>이미지 테마 저장소</h2>
      <div className="theme-group">
        {Object.entries(themes).map(([theme, images]) => (
          <div key={theme}>
            <h3>{theme}</h3>
            <div className="theme-row">
              {images.map((img, idx) => (
                <div key={idx} className="theme-item" onClick={() => handleThemeSelect(img)}>
                  <img src={img.src} alt={img.label} />
                  <div>{img.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageThemePage;
