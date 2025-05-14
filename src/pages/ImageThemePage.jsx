import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const images = [
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
  "/backgrounds/cosmos.jpg"
];

const ImageThemePage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelect = (src) => {
    setSelectedImage(src);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      for (let i = 1; i <= 4; i++) {
        if (!localStorage.getItem(`img-${i}`)) {
          localStorage.setItem(`img-${i}`, selectedImage);
          break;
        }
      }
      // ✅ 수정된 부분: navigate로 이동
      navigate("/image/select");
    } else {
      alert("먼저 이미지를 선택해주세요.");
    }
  };

  return (
    <div className="image-theme-page">
      <h2 className="image-theme-title">이미지 테마 저장소</h2>
      <div className="image-grid">
        {images.map((src) => (
          <div
            key={src}
            className={`thumbnail ${selectedImage === src ? "selected" : ""}`}
            onClick={() => handleSelect(src)}
          >
            <img src={src} alt="thumb" />
          </div>
        ))}
      </div>
      <button className="confirm-button" onClick={handleConfirm}>
        확인하고 넘어가기
      </button>
    </div>
  );
};

export default ImageThemePage;
