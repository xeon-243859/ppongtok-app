import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageSelectPage.css';

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([null, null, null, null]);

  const handleLocalFileSelect = (event) => {
    const files = event.target.files;
    const newSelected = [...selectedImages];

    for (let i = 0; i < files.length && i < 4; i++) {
      const fileURL = URL.createObjectURL(files[i]);
      newSelected[i] = { src: fileURL, label: files[i].name };
    }

    setSelectedImages(newSelected);
  };

  const fileInputRef = React.useRef(null);

  const handleImageFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
        <button onClick={handleImageFileClick}>내파일선택</button>
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
