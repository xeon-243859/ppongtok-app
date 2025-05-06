import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";
import { Typewriter } from "react-simple-typewriter";

const imageList = [
  "/backgrounds/cosmos.jpg",
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg"
];

export default function ImageSelectPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  const handleNext = () => {
    if (!selectedImage) {
      alert("배경 이미지를 선택해주세요.");
      return;
    }
    navigate("/music/select", { state: { backgroundImage: selectedImage } });
  };

  return (
    <div className="image-select-container">
      <div className="title-text">
        <span>
          <Typewriter
            words={["배경으로 사용할 이미지 4개를", "선택해주세요"]}
            loop={1}
            cursor
            typeSpeed={50}
            deleteSpeed={0}
            delaySpeed={1000}
          />
        </span>
      </div>

      <div className="image-thumbnails">
        {imageList.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`img-${idx}`}
            className={`thumbnail ${selectedImage === img ? "selected" : ""}`}
            onClick={() => handleImageClick(img)}
          />
        ))}
      </div>

      <div className="preview-slot">
        {selectedImage ? (
          <img src={selectedImage} alt="선택된 이미지" className="preview-img" />
        ) : (
          <div className="empty-slot">img-0 (선택된 이미지가 여기에 나타납니다)</div>
        )}
      </div>

      <div className="upload-section">
        <label className="upload-button">
          내 파일에서 선택
          <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
        </label>
      </div>

      <div className="button-group">
        <button onClick={() => navigate("/style")}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}
