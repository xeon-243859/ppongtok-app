import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageBackgroundPage.css';

const images = [
  '/backgrounds/cosmos.jpg',
  '/backgrounds/leaves.jpg',
  '/backgrounds/road.jpg',
  '/backgrounds/water.jpg'
];

export default function ImageBackgroundPage({ setSelectedImage }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (img) => {
    setSelected(img);
    setSelectedImage(img);
  };

  return (
    <div className="image-background-container">
      <h2>이미지 배경을 선택해 주세요</h2>
      <div className="image-options">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`bg-${index}`}
            className={selected === img ? 'selected' : ''}
            onClick={() => handleSelect(img)}
          />
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={() => navigate('/love/style')}>뒤로가기</button>
        <button onClick={() => navigate('/love/music')} disabled={!selected}>다음으로</button>
      </div>
    </div>
  );
}
