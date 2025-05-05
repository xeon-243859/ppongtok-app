import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([null, null, null, null]);

  const dummyImages = [
    "/backgrounds/warm1.jpg",
    "/backgrounds/warm2.jpg",
    "/backgrounds/warm3.jpg",
    "/backgrounds/warm4.jpg",
  ];

  const handleSelect = (img) => {
    const index = selectedImages.findIndex((item) => item === null);
    if (index !== -1) {
      const newSelection = [...selectedImages];
      newSelection[index] = img;
      setSelectedImages(newSelection);
    }
  };

  return (
    <div className="image-select-wrapper">
      <h2 className="title">네번째 화면 · 이미지 배경화면</h2>
      <div className="tabs">
        <button className="tab">따뜻한</button>
        <button className="tab">설레임</button>
        <button className="tab">그리움</button>
        <button className="tab">감성적인</button>
        <button className="tab">내파일선택</button>
      </div>

      <div className="image-grid">
        {dummyImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`배경 ${idx + 1}`}
            className="bg-img"
            onClick={() => handleSelect(img)}
          />
        ))}
      </div>

      <div className="selected-preview">
        {selectedImages.map((img, idx) => (
          <div key={idx} className="preview-box">
            {img ? <img src={img} alt="선택됨" /> : <span>{idx + 1}번</span>}
          </div>
        ))}
      </div>

      <div className="nav-buttons">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/love/video")}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
