import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const ImageThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (relativePath) => {
    const slot = localStorage.getItem("selected-slot");
    if (!slot) {
      alert("슬롯이 설정되지 않았습니다.");
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg");

      localStorage.setItem(slot, base64);
      localStorage.removeItem("selected-slot");
      console.log(`✅ ${slot}에 base64 저장 완료`);
      navigate("/image/select");
    };
    image.onerror = () => {
      alert("이미지를 불러올 수 없습니다.");
    };
    image.src = `${window.location.origin}${relativePath}`;
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
