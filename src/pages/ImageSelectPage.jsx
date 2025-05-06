import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState({});

  const images = [
    "/backgrounds/cosmos.jpg",
    "/backgrounds/leaves.jpg",
    "/backgrounds/road.jpg",
    "/backgrounds/water.jpg",
  ];

  const handleImageClick = (index) => {
    setSelectedImages((prev) => ({
      ...prev,
      [`img-${index}`]: images[index],
    }));
  };

  const handleNextClick = () => {
    // 선택된 이미지 중 첫 번째 이미지만 사용하여 이동
    const firstSelected = Object.values(selectedImages)[0];
    if (firstSelected) {
      localStorage.setItem("selectedBackground", firstSelected);
      navigate("/music/select");
    } else {
      alert("이미지를 선택해주세요.");
    }
  };

  return (
    <div className="image-select-page">
      <h2 className="typewriter">
        배경으로 사용할 이미지 4개를<br />선택해 주세요
      </h2>
      <div className="image-grid">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`이미지${index + 1}`}
            className={
              selectedImages[`img-${index}`] ? "selected" : "thumbnail"
            }
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
      <div className="selection-slots">
        {[0, 1, 2, 3].map((num) => (
          <div key={num} className="image-slot">
            {selectedImages[`img-${num}`] && (
              <img src={selectedImages[`img-${num}`]} alt={`선택${num}`} />
            )}
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="back-button" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
        <button className="next-button" onClick={handleNextClick}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
