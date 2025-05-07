import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageSelectPage.css';

const imageThemes = {
  따뜻한: [
    { src: '/backgrounds/cosmos.jpg', label: '따뜻한1' },
    { src: '/backgrounds/leaves.jpg', label: '따뜻한2' },
  ],
  낭만적인: [
    { src: '/backgrounds/road.jpg', label: '낭만적인1' },
    { src: '/backgrounds/water.jpg', label: '낭만적인2' },
  ],
  화려한: [],
  감성적인: [],
};

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [showThemes, setShowThemes] = useState(false);
  const [selectedImages, setSelectedImages] = useState([null, null, null, null]);
  const [currentThemeImages, setCurrentThemeImages] = useState([]);

  const handleImageFileClick = () => {
    setShowThemes(true);
  };

  const handleThemeClick = (theme) => {
    setCurrentThemeImages(imageThemes[theme] || []);
  };

  const handleImageSelect = (img) => {
    const index = selectedImages.findIndex((slot) => slot === null);
    if (index !== -1) {
      const newSelected = [...selectedImages];
      newSelected[index] = img;
      setSelectedImages(newSelected);
    }
  };

  return (
    <div className="image-select-container">
      <div className="image-select-title">배경으로 사용할 이미지 1개를</div>
      <div className="image-select-sub">선택해주세요</div>

      <div className="button-row">
        <button onClick={handleImageFileClick}>이미지파일</button>
        <button>내파일선택</button>
      </div>

      {showThemes && (
        <div className="theme-buttons">
          {Object.keys(imageThemes).map((theme) => (
            <button key={theme} onClick={() => handleThemeClick(theme)}>
              {theme}
            </button>
          ))}
        </div>
      )}

      <div className="image-grid">
        {currentThemeImages.map((img, idx) => (
          <div
            key={idx}
            className="image-option"
            onClick={() => handleImageSelect(img)}
          >
            <img src={img.src} alt={img.label} />
            <span>{img.label}</span>
          </div>
        ))}
      </div>

      <div className="slot-row">
        {selectedImages.map((img, idx) => (
          <div key={idx} className="slot-box">
            {img ? <img src={img.src} alt={`img-${idx + 1}`} /> : `img-0${idx + 1}`}
          </div>
        ))}
      </div>

      <div className="image-select-footer">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate('/music/select')}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
