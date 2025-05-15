import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const images = [
  { id: 1, src: "/backgrounds/cosmos.jpg", label: "따뜻한1" },
  { id: 2, src: "/backgrounds/leaves.jpg", label: "따뜻한2" },
  { id: 3, src: "/backgrounds/road.jpg", label: "낭만적인1" },
  { id: 4, src: "/backgrounds/water.jpg", label: "낭만적인2" },
];

const ImageSelectPage = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  const handleImageClick = (image) => {
    if (selectedImages.find((img) => img.id === image.id)) {
      const updated = selectedImages.filter((img) => img.id !== image.id);
      setSelectedImages(updated);
      localStorage.setItem("selected-images", JSON.stringify(updated));
    } else {
      if (selectedImages.length < 4) {
        const updated = [...selectedImages, image];
        setSelectedImages(updated);
        localStorage.setItem("selected-images", JSON.stringify(updated));
      } else {
        alert("최대 4장까지 선택할 수 있어요!");
      }
    }
  };

  const handleNext = () => {
    if (selectedImages.length === 0) {
      alert("배경으로 사용할 이미지를 1장 이상 선택해주세요!");
    } else {
      localStorage.setItem("selected-type", "image"); // 미리보기용 타입 지정
      navigate("/music/select"); // ✅ 여기서 음악 선택 페이지로 이동
    }
  };

  const handleBack = () => {
    navigate("/love/form");
  };

  return (
    <div className="image-select-page">
      <h2 className="typing-text">배경으로 사용할 이미지를 선택해주세요</h2>
      <div className="image-buttons">
      <button onClick={() => alert("🔧 추후 구현 예정")}>배경이미지 파일</button>
      <button onClick={() => alert("🔧 추후 구현 예정")}>내 파일 선택</button>
     </div>

      <div className="image-grid">
        {images.map((image) => (
          <div
            key={image.id}
            className={`image-box ${
              selectedImages.find((img) => img.id === image.id) ? "selected" : ""
            }`}
            onClick={() => handleImageClick(image)}
          >
            <img src={image.src} alt={image.label} />
            <div className="label">{image.label}</div>
          </div>
        ))}
      </div>

      <div className="preview-box">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="preview-slot">
            {selectedImages[i] && (
              <img src={selectedImages[i].src} alt={`선택된 이미지 ${i + 1}`} />
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
