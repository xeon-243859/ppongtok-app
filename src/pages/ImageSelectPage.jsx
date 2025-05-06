import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ImageSelectPage.css";

const images = [
  "/backgrounds/cosmos.jpg",
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
];

function ImageSelectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (image) => {
    setSelected(image);
  };

  const handleNext = () => {
    if (selected) {
      localStorage.setItem("selectedBackground", selected);
      navigate("/music/select");
    }
  };

  return (
    <div className="image-select-container">
      <h2 className="image-select-title">배경으로 사용할 이미지를 선택해주세요</h2>
      <div className="image-grid">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`background-${idx}`}
            className={`thumbnail ${selected === src ? "selected" : ""}`}
            onClick={() => handleSelect(src)}
          />
        ))}
      </div>
      <button className="next-button" onClick={handleNext} disabled={!selected}>
        다음으로
      </button>
    </div>
  );
}

export default ImageSelectPage;
