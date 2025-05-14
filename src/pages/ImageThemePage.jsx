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
      // localStorage에서도 제거
      for (let i = 1; i <= 4; i++) {
        if (localStorage.getItem(`img-${i}`) === normalizedSrc) {
          localStorage.removeItem(`img-${i}`);
          break;
        }
      }
    } else {
      if (selected.length >= 4) return;
      updated = [...selected, normalizedSrc];
      // 빈 슬롯에 저장
      for (let i = 1; i <= 4; i++) {
        if (!localStorage.getItem(`img-${i}`)) {
          localStorage.setItem(`img-${i}`, normalizedSrc);
          break;
        }
      }
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
        navigate("/music/select"); // ✅ 정확한 다음 경로로 수정
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
