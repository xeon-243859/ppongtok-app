import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const images = [
  { id: 1, src: "/backgrounds/cosmos.jpg", label: "따뜻한1" },
  { id: 2, src: "/backgrounds/leaves.jpg", label: "따뜻한2" },
  { id: 3, src: "/backgrounds/road.jpg", label: "낭만적인1" },
  { id: 4, src: "/backgrounds/water.jpg", label: "낭만적인2" },
];

const ImageSelectPage = () => {
  const [selectedImages, setSelectedImages] = useState(
    JSON.parse(localStorage.getItem("selected-images")) || []
  );
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    if (selectedImages.find((img) => img.id === image.id)) {
      const updated = selectedImages.filter((img) => img.id !== image.id);
      setSelectedImages(updated);
      localStorage.setItem("selected-images", JSON.stringify(updated));
    } else {
      if (selectedImages.length < 4) {
        const updated = [...selectedImages, image];
        setSelectedImages(updated);
        localStorage.setItem("selected-images", JSON.stringify(updated));
      } else {
        alert("최대 4장까지 선택할 수 있어요!");
      }
    }
  };

  const handleRemove = (index) => {
    const updated = [...selectedImages];
    updated.splice(index, 1);
    setSelectedImages(updated);
    localStorage.setItem("selected-images", JSON.stringify(updated));
  };

  const handleNext = () => {
    if (selectedImages.length === 0) {
      alert("배경으로 사용할 이미지를 1장 이상 선택해주세요!");
    } else {
      localStorage.setItem("selected-type", "image");
      navigate("/music/select");
    }
  };

  const handleBack = () => {
    navigate("/love/form");
  };

  return (
    <div className="image-select-page">
      <div className="typing-text">
        <div className="line1">배경으로 사용할 이미지 4개를</div>
        <div className="line2">선택해 주세요</div>
      </div>

      <div className="image-grid">
        {images.map((image) => (
          <div
            key={image.id}
            className={`image-box ${
              selectedImages.find((img) => img.id === image.id) ? "selected" : ""
            }`}
            onClick={() => handleImageClick(image)}
          >
            <img src={image.src} alt={image.label} />
            <div className="label">{image.label}</div>
          </div>
        ))}
      </div>

      <div className="preview-box">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="preview-slot">
            {selectedImages[i] && (
              <div className="slot-container">
                <img src={selectedImages[i].src} alt={`선택된 이미지 ${i + 1}`} />
                <button className="delete-button" onClick={() => handleRemove(i)}>X</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
