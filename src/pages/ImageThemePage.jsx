import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const ImageThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (imagePath) => {
    const slot = localStorage.getItem("selected-slot");
    console.log("📌 저장할 슬롯 확인:", slot);  // 📌 확인 포인트

    if (!slot) {
      alert("슬롯이 설정되지 않았습니다. '이미지파일' 버튼을 먼저 눌러주세요.");
      return;
    }

    localStorage.setItem(slot, imagePath);
    console.log(`✅ ${slot}에 이미지 저장 완료`);
    localStorage.removeItem("selected-slot");
    navigate("/image/select");
  };

  return (
    <div className="image-theme-container">
      <h2>이미지 테마 저장소</h2>

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
