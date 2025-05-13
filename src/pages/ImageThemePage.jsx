// ✅ ImageThemePage.jsx 전체코드 (이미지 선택 시 자동 저장)
import React, { useState } from "react";
import "./ImageThemePage.css";

const images = [
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
  "/backgrounds/cosmos.jpg"
];

const ImageThemePage = () => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (src) => {
    let updated;
    if (selected.includes(src)) {
      updated = selected.filter((item) => item !== src);
    } else {
      updated = selected.length < 4 ? [...selected, src] : selected;
    }
    setSelected(updated);
    // ✅ 자동 저장
    localStorage.setItem("selected-images", JSON.stringify(updated));
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
  };

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
