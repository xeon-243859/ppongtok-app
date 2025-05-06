// src/pages/ImageSelectPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ImageSelectPage.css";

const images = [
  "cosmos.jpg",
  "leaves.jpg",
  "road.jpg",
  "water.jpg",
];

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleSelect = (img) => {
    setSelected(img);
    localStorage.setItem("selectedImage", img);
    localStorage.setItem("backgroundType", "image");
  };

  const goNext = () => {
    if (!selected) {
      alert("이미지를 선택해주세요!");
      return;
    }
    navigate("/music/select");
  };

  return (
    <div className="image-select-wrapper">
      <h2 className="image-select-title">배경으로 사용할 이미지를 선택해주세요</h2>

      <div className="thumbnail-grid">
        {images.map((img) => (
          <img
            key={img}
            src={`/backgrounds/${img}`}
            alt={img}
            className={`thumbnail ${selected === img ? "selected" : ""}`}
            onClick={() => handleSelect(img)}
          />
        ))}
      </div>

      <div className="image-select-buttons">
        <button onClick={() => navigate(-1)}>← 뒤로가기</button>
        <button onClick={goNext}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
