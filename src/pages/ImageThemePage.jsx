import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const ImageThemePage = () => {
  const navigate = useNavigate();
  const [slotIndex, setSlotIndex] = useState(1); // img-1부터 시작

  const handleSelect = (imagePath) => {
    const slot = `img-${slotIndex}`;
    localStorage.setItem(slot, imagePath);
    setSlotIndex((prev) => (prev % 4) + 1); // 1→2→3→4→1 순환
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

      {/* 필요에 따라 다른 테마도 추가 */}
    </div>
  );
};

export default ImageThemePage;
