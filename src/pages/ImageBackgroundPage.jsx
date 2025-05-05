import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageBackgroundPage.css';

const defaultImages = [
  '/backgrounds/cosmos.jpg',
  '/backgrounds/leaves.jpg',
  '/backgrounds/road.jpg',
  '/backgrounds/water.jpg',
];

function ImageBackgroundPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  const handleSelectImage = (src) => {
    if (selectedImages.length < 4 && !selectedImages.includes(src)) {
      setSelectedImages([...selectedImages, src]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedImages.length < 4) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImages([...selectedImages, imageUrl]);
    }
  };

  const handleNext = () => {
    localStorage.setItem('selectedImages', JSON.stringify(selectedImages));
    navigate('/love/video'); // 4-2로 바로 이동
  };

  const handleBack = () => {
    navigate('/style/select');
  };

  return (
    <div className="image-bg-container">
      <h2>이미지배경화면</h2>

      <div className="style-buttons">
        <button onClick={() => handleSelectImage(defaultImages[0])}>따뜻한</button>
        <button onClick={() => handleSelectImage(defaultImages[1])}>설레임</button>
        <button onClick={() => handleSelectImage(defaultImages[2])}>그리움</button>
        <button onClick={() => handleSelectImage(defaultImages[3])}>감성적인</button>
      </div>

      <label className="upload-box">
        내 파일 선택
        <input type="file" accept="image/*" onChange={handleFileChange} hidden />
      </label>

      <div className="preview-grid">
        {selectedImages.map((img, idx) => (
          <img key={idx} src={img} alt={`선택배경${idx}`} />
        ))}
      </div>

      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}

export default ImageBackgroundPage;
