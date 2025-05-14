// ✅ ImageThemePage.jsx (이미지 선택 후 /music/select 이동)
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
    const normalizedSrc = src.toLowerCase();
    let updated;
    if (selected.includes(normalizedSrc)) {
      updated = selected.filter((item) => item !== normalizedSrc);
    } else {
      updated = selected.length < 4 ? [...selected, normalizedSrc] : selected;
    }
    console.log("🔥 클릭됨:", normalizedSrc);
    console.log("🧠 업데이트할 selected:", updated);
    setSelected(updated);
    localStorage.setItem("selected-images", JSON.stringify(updated));
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
  };

  useEffect(() => {
    if (selected.length === 4) {
      setTimeout(() => {
        navigate("/image/theme"); // ✅ 음악 선택 페이지로 이동하도록 수정
      }, 300);
    }
  }, [selected, navigate]);

  return (
    <div className="image-theme-page">
      <h2>이미지 배경 선택 (최대 4개)</h2>
      <div className="image-grid">
        {images.map((src) => (
          <div
            key={src}
            className={`thumbnail ${selected.includes(src.toLowerCase()) ? "selected" : ""}`}
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
