// src/pages/ImageThemePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const ImageThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (imagePath) => {
    const slot = localStorage.getItem("selected-slot") || "img-1";
    localStorage.setItem(slot, imagePath);
    navigate("/image/select");
  };
  

  return (
    <div className="image-theme-container">
      <h2>이미지 테마 저장소</h2>

      <h3>따뜻한</h3>
      <div className="image-row">
        <div className="image-option" onClick={() => handleSelect("img-1", "/backgrounds/cosmos.jpg")}>
          <img src="/backgrounds/cosmos.jpg" alt="따뜻한1" />
          <p>따뜻한1</p>
        </div>
        <div className="image-option" onClick={() => handleSelect("img-1", "/backgrounds/leaves.jpg")}>
          <img src="/backgrounds/leaves.jpg" alt="따뜻한2" />
          <p>따뜻한2</p>
        </div>
      </div>

      <h3>낭만적인</h3>
      <div className="image-row">
        <div className="image-option" onClick={() => handleSelect("img-1", "/backgrounds/road.jpg")}>
          <img src="/backgrounds/road.jpg" alt="낭만적인1" />
          <p>낭만적인1</p>
        </div>
        <div className="image-option" onClick={() => handleSelect("img-1", "/backgrounds/water.jpg")}>
          <img src="/backgrounds/water.jpg" alt="낭만적인2" />
          <p>낭만적인2</p>
        </div>
      </div>
    </div>
  );
};

export default ImageThemePage;
