import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selected-images")) || [];
    setSelectedImages(saved);
  }, []);

  const handleRemove = (index) => {
    const updated = [...selectedImages];
    updated.splice(index, 1);
    setSelectedImages(updated);
    localStorage.setItem("selected-images", JSON.stringify(updated));
  };

  const handleNext = () => {
    if (selectedImages.length === 0) {
      alert("이미지를 1장 이상 선택해주세요!");
      return;
    }
    localStorage.setItem("selected-type", "image");
    navigate("/music/select");
  };

  const handleBack = () => {
    navigate("/love/form");
  };

  const handleTheme = () => {
    navigate("/image/theme");
  };

  const handleMyFile = () => {
    alert("🔧 내 파일 선택은 추후 구현 예정입니다.");
  };

  return (
    <div className="image-select-page">
      <div className="typing-text">
        <div className="line1">배경으로 사용할 이미지 4개를</div>
        <div className="line2">선택해 주세요</div>
      </div>

      <div className="image-buttons">
        <button onClick={handleTheme}>배경이미지 파일</button>
        <button onClick={handleMyFile}>내 파일 선택</button>
      </div>

      <div className="preview-box-grid">
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
