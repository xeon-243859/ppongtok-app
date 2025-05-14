// ✅ ImageThemePage.jsx 전체코드 (handleSelect 로그 포함)
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
    console.log("🔥 클릭됨:", src);
    console.log("🧠 업데이트할 selected:", updated);
    setSelected(updated);
    localStorage.setItem("selected-images", JSON.stringify(updated));
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
  };

  useEffect(() => {
    if (selected.length === 4) {
      setTimeout(() => {
        navigate("/preview");
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
