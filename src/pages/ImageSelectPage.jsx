import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageSelectPage.css';

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([null, null, null, null]);
  const [showThemes, setShowThemes] = useState(false);

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

  const handleLocalFileSelect = (event) => {
    const files = event.target.files;
    const newSelected = [...selectedImages];

    for (let i = 0; i < files.length; i++) {
      const fileURL = URL.createObjectURL(files[i]);
      const emptyIndex = newSelected.findIndex(img => img === null);
      if (emptyIndex !== -1) {
        newSelected[emptyIndex] = { src: fileURL, label: files[i].name };
      }
    }

    setSelectedImages(newSelected);
  };

  const handleThemeClick = (theme) => {
    const themeImages = themes[theme];
    const newSelected = [...selectedImages];

    for (let i = 0; i < themeImages.length; i++) {
      const emptyIndex = newSelected.findIndex(img => img === null);
      if (emptyIndex !== -1) {
        newSelected[emptyIndex] = themeImages[i];
      }
    }

    setSelectedImages(newSelected);
  };

  const fileInputRef = React.useRef(null);

  const handleImageFileClick = () => {
    setShowThemes(true);
  };

  return (
    <div className="image-select-container">
      <div className="image-select-title">배경으로 사용할 이미지 1개를</div>
      <div className="image-select-sub">선택해주세요</div>

      <div className="button-row">
        <button onClick={handleImageFileClick}>이미지파일</button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleLocalFileSelect}
        />
        <button onClick={() => fileInputRef.current.click()}>내파일선택</button>
      </div>

      {showThemes && (
        <div className="theme-buttons">
          {Object.keys(themes).map(theme => (
            <button key={theme} onClick={() => handleThemeClick(theme)}>{theme}</button>
          ))}
        </div>
      )}

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
