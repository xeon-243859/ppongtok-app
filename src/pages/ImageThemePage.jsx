import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const ImageThemePage = () => {
  const navigate = useNavigate();
  const [slotIndex, setSlotIndex] = useState(1);

  // 🔹 페이지 진입 시 localStorage에 저장된 인덱스 불러오기
  useEffect(() => {
    const savedIndex = parseInt(localStorage.getItem("slot-index")) || 1;
    setSlotIndex(savedIndex);
  }, []);

  const handleSelect = (imagePath) => {
    const slot = `img-${slotIndex}`;
    localStorage.setItem(slot, imagePath);
    const nextIndex = (slotIndex % 4) + 1; // 1→2→3→4→1 순환
    localStorage.setItem("slot-index", nextIndex); // 🔹 인덱스를 저장!
    setSlotIndex(nextIndex);
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
    </div>
  );
};

export default ImageThemePage;
