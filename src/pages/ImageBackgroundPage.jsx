// src/pages/ImageBackgroundPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageBackgroundPage.css";

const imageList = [
  "/backgrounds/cosmos.jpg",
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg"
];

function ImageBackgroundPage({ setSelectedImage }) {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");

  const handleSelect = (img) => {
    setSelectedImage(img);
    setPreviewImage(img);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <div className="image-background-container">
      <h2>어떤 배경으로 사랑을 담아볼까요?</h2>
      <div className="background-options">
        {imageList.map((img, index) => (
          <button key={index} onClick={() => handleSelect(img)}>
            {["따뜻한", "설레임", "그리움", "감성적인"][index]}
          </button>
        ))}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="선택한 배경" />
        </div>
      )}
      <div className="navigation-buttons">
        <button onClick={() => navigate("/style/select")}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
}

export default ImageBackgroundPage;
