// ImageSelectPage.jsx - 슬롯에 따라 이미지 테마 선택 화면
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const imageThemes = {
  "img-01": [
    { id: 1, label: "따뜻한1", src: "/backgrounds/cosmos.jpg" },
    { id: 2, label: "따뜻한2", src: "/backgrounds/leaves.jpg" },
  ],
  "img-02": [
    { id: 3, label: "낭만적인1", src: "/backgrounds/road.jpg" },
    { id: 4, label: "낭만적인2", src: "/backgrounds/water.jpg" },
  ],
  "img-03": [
    { id: 5, label: "화려한1", src: "/backgrounds/cosmos.jpg" },
    { id: 6, label: "화려한2", src: "/backgrounds/leaves.jpg" },
  ],
  "img-04": [
    { id: 7, label: "감성적인1", src: "/backgrounds/road.jpg" },
    { id: 8, label: "감성적인2", src: "/backgrounds/water.jpg" },
  ],
};

const ImageSelectPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const slot = location.state?.slot || "img-01";
    setImages(imageThemes[slot] || []);
  }, [location.state]);

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
        {images.map((img) => (
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
