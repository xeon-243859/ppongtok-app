// File: ImageSelectPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageSelectPage.css';

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([null, null, null, null]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('selectedImages')) || [null, null, null, null];
    setSelectedImages(saved);
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    const stored = [...selectedImages];
    for (let i = 0; i < files.length; i++) {
      const emptyIndex = stored.findIndex(img => img === null);
      if (emptyIndex !== -1) {
        const fileURL = URL.createObjectURL(files[i]);
        stored[emptyIndex] = { src: fileURL, label: files[i].name };
      }
    }
    setSelectedImages(stored);
    localStorage.setItem('selectedImages', JSON.stringify(stored));
  };

  return (
    <div className="image-select-container">
      <div className="image-select-title">배경으로 사용할 이미지 1개를</div>
      <div className="image-select-title">선택해주세요</div>

      <div className="button-row">
        <button onClick={() => navigate('/image/theme')}>이미지파일</button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <button onClick={() => fileInputRef.current.click()}>내파일선택</button>
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
