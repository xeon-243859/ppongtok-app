// src/pages/ImageThemePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const ImageThemePage = () => {
  const navigate = useNavigate();
  const [slot, setSlot] = useState("img-1");

  // 저장될 슬롯(img-1, img-2...) 확인
  useEffect(() => {
    const selected = localStorage.getItem("selected-slot");
    if (selected) setSlot(selected);
  }, []);

  const handleSelect = (imagePath) => {
    localStorage.setItem(slot, imagePath);
    navigate("/image/select");
  };

  return (
    <div className="image-theme-container">
      <h2>이미지 테마 저장소</h2>

      <h3>사랑</h3>
      <div className="image-row">
        <div className="image-option" onClick={() => handleSelect("/backgrounds/love/love1.jpg")}>
          <img src="/backgrounds/love/love1.jpg" alt="사랑1" />
          <p>사랑1</p>
        </div>
        <div className="image-option" onClick={() => handleSelect("/backgrounds/love/love2.jpg")}>
          <img src="/backgrounds/love/love2.jpg" alt="사랑2" />
          <p>사랑2</p>
        </div>
      </div>

      <h3>그리움</h3>
      <div className="image-row">
        <div className="image-option" onClick={() => handleSelect("/backgrounds/miss/miss1.jpg")}>
          <img src="/backgrounds/miss/miss1.jpg" alt="그리움1" />
          <p>그리움1</p>
        </div>
        <div className="image-option" onClick={() => handleSelect("/backgrounds/miss/miss2.jpg")}>
          <img src="/backgrounds/miss/miss2.jpg" alt="그리움2" />
          <p>그리움2</p>
        </div>
      </div>

      <h3>감정</h3>
      <div className="image-row">
        <div className="image-option" onClick={() => handleSelect("/backgrounds/emotion/emo1.jpg")}>
          <img src="/backgrounds/emotion/emo1.jpg" alt="감정1" />
          <p>감정1</p>
        </div>
        <div className="image-option" onClick={() => handleSelect("/backgrounds/emotion/emo2.jpg")}>
          <img src="/backgrounds/emotion/emo2.jpg" alt="감정2" />
          <p>감정2</p>
        </div>
      </div>

      <h3>따뜻한</h3>
      <div className="image-row">
        <div className="image-option" onClick={() => handleSelect("/backgrounds/warm/warm1.jpg")}>
          <img src="/backgrounds/warm/warm1.jpg" alt="따뜻한1" />
          <p>따뜻한1</p>
        </div>
        <div className="image-option" onClick={() => handleSelect("/backgrounds/warm/warm2.jpg")}>
          <img src="/backgrounds/warm/warm2.jpg" alt="따뜻한2" />
          <p>따뜻한2</p>
        </div>
      </div>
    </div>
  );
};

export default ImageThemePage;
