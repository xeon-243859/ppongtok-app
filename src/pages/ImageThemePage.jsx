import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const ImageThemePage = () => {
  const navigate = useNavigate();

  // ✅ 이미지 클릭 → selected-slot 확인 후 해당 슬롯에 저장
  const handleSelect = (imagePath) => {
    const slot = localStorage.getItem("selected-slot");

    if (!slot) {
      alert("슬롯이 선택되지 않았습니다. 먼저 '이미지파일'을 눌러주세요.");
      return;
    }

    localStorage.setItem(slot, imagePath);
    localStorage.removeItem("selected-slot"); // 저장 후 슬롯 초기화
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
    </div>
  );
};

export default ImageThemePage;
