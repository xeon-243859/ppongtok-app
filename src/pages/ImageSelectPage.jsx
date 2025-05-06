import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const images = [
  "/images/cosmos.jpg",
  "/images/leaves.jpg",
  "/images/road.jpg",
  "/images/water.jpg",
];

function ImageSelectPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  const toggleSelectImage = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img !== image));
    } else if (selectedImages.length < 4) {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleNext = () => {
    if (selectedImages.length > 0) {
      localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
      navigate("/music/select");
    } else {
      alert("최소 한 개의 이미지를 선택해주세요.");
    }
  };

  const handleBack = () => {
    navigate("/love/style");
  };

  return (
    <div className="image-select-container">
      <h2 className="title">배경으로 사용할 이미지를 선택해 주세요</h2>

      <div className="image-grid">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`img-${index}`}
            className={selectedImages.includes(img) ? "selected" : ""}
            onClick={() => toggleSelectImage(img)}
          />
        ))}
      </div>

      <div className="selected-preview">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="preview-slot" key={idx}>
            {selectedImages[idx] && <img src={selectedImages[idx]} alt={`selected-${idx}`} />}
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={handleBack} className="back">뒤로가기</button>
        <button onClick={handleNext} className="next">다음으로</button>
      </div>
    </div>
  );
}

export default ImageSelectPage;
