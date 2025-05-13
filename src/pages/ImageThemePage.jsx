// ✅ ImageThemePage.jsx 전체코드 (4개 선택 시 자동 /preview 이동)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const images = [
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
  "/backgrounds/cosmos.jpg"
];

const ImageThemePage = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const handleSelect = (src) => {
    let updated;
    if (selected.includes(src)) {
      updated = selected.filter((item) => item !== src);
    } else {
      updated = selected.length < 4 ? [...selected, src] : selected;
    }
    setSelected(updated);
    localStorage.setItem("selected-images", JSON.stringify(updated));
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
  };

  // ✅ 4개 선택 시 자동 이동
  useEffect(() => {
    if (selected.length === 4) {
      setTimeout(() => {
        navigate("/preview");
      }, 300); // 약간의 딜레이로 자연스럽게
    }
  }, [selected, navigate]);

  return (
    <div className="image-theme-page">
      <h2>이미지 배경 선택 (최대 4개)</h2>
      <div className="image-grid">
        {images.map((src) => (
          <div
            key={src}
            className={`thumbnail ${selected.includes(src) ? "selected" : ""}`}
            onClick={() => handleSelect(src)}
          >
            <img src={src} alt="thumb" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageThemePage;
