// ImageSelectPage.jsx - 슬롯에 따라 이미지 테마 선택 화면
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const imageThemes = {
  "따뜻한": [
    { id: 1, label: "따뜻한1", src: "/backgrounds/cosmos.jpg" },
    { id: 2, label: "따뜻한2", src: "/backgrounds/leaves.jpg" },
  ],
  "낭만적인": [
    { id: 3, label: "낭만적인1", src: "/backgrounds/road.jpg" },
    { id: 4, label: "낭만적인2", src: "/backgrounds/water.jpg" },
  ],
  "화려한": [
    { id: 5, label: "화려한1", src: "/backgrounds/cosmos.jpg" },
    { id: 6, label: "화려한2", src: "/backgrounds/leaves.jpg" },
  ],
  "감성적인": [
    { id: 7, label: "감성적인1", src: "/backgrounds/road.jpg" },
    { id: 8, label: "감성적인2", src: "/backgrounds/water.jpg" },
  ],
};

const ImageSelectPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [slots, setSlots] = useState([null, null, null, null]);
  const navigate = useNavigate();

  const handleSelectStorage = (theme) => {
    setImages(imageThemes[theme] || []);
  };

  const handleChooseImage = (src) => {
    const newSlots = [...slots];
    const emptyIndex = newSlots.findIndex((s) => s === null);
    if (emptyIndex !== -1) {
      newSlots[emptyIndex] = src;
      setSlots(newSlots);
    }
  };

  const handleNext = () => {
    navigate("/music/select", { state: { selectedImages: slots } });
  };

  return (
    <div className="image-select-container">
      <h2 className="image-select-title">배경으로 사용할 이미지 1개를</h2>
      <p className="image-select-sub">선택해주세요</p>

      <div className="button-row">
        <button onClick={() => alert("이미지파일 저장소 열기")}>이미지파일</button>
        <button onClick={() => alert("로컬 파일 선택")}>내파일선택</button>
      </div>

      <div className="theme-buttons">
        {Object.keys(imageThemes).map((theme) => (
          <button key={theme} onClick={() => handleSelectStorage(theme)}>
            {theme}
          </button>
        ))}
      </div>

      <div className="image-grid">
        {images.map((img) => (
          <div
            key={img.id}
            className="image-option"
            onClick={() => handleChooseImage(img.src)}
          >
            <img src={img.src} alt={img.label} />
            <span>{img.label}</span>
          </div>
        ))}
      </div>

      <div className="slot-row">
        {slots.map((img, i) => (
          <div key={i} className="slot-box">
            {img ? <img src={img} alt={`slot-${i + 1}`} /> : `img-0${i + 1}`}
          </div>
        ))}
      </div>

      <div className="image-select-footer">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
