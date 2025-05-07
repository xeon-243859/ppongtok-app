// ImageSelectPage.jsx - 이미지 저장소 선택 화면
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const imageOptions = [
  { id: 1, label: "따뜻한", src: "/backgrounds/cosmos.jpg" },
  { id: 2, label: "낭만적인", src: "/backgrounds/leaves.jpg" },
  { id: 3, label: "화려한", src: "/backgrounds/road.jpg" },
  { id: 4, label: "감성적인", src: "/backgrounds/water.jpg" },
];

const ImageSelectPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (src) => {
    setSelectedImage(src);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    navigate("/music/select", { state: { selectedImage } });
  };

  return (
    <div className="image-select-container">
      <h2 className="image-select-title">배경으로 사용할 이미지 1개를</h2>
      <p className="image-select-sub">선택해주세요</p>

      <div className="image-grid">
        {imageOptions.map((img) => (
          <div
            key={img.id}
            className={`image-option ${selectedImage === img.src ? "selected" : ""}`}
            onClick={() => handleSelect(img.src)}
          >
            <img src={img.src} alt={img.label} />
            <span>{img.label}</span>
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
