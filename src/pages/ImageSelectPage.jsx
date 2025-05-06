import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const imageOptions = [
    { id: "img-01", src: "cosmos.jpg" },
    { id: "img-02", src: "leaves.jpg" },
    { id: "img-03", src: "road.jpg" },
    { id: "img-04", src: "water.jpg" },
  ];

  const [selectedImages, setSelectedImages] = useState([]);

  const handleSelect = (imgId) => {
    if (selectedImages.includes(imgId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imgId));
    } else if (selectedImages.length < 4) {
      setSelectedImages([...selectedImages, imgId]);
    }
  };

  const handleNext = () => {
    if (selectedImages.length > 0) {
      navigate("/music/select", {
        state: { backgroundType: "image", selected: selectedImages },
      });
    }
  };

  const handleBack = () => {
    navigate("/style");
  };

  return (
    <div className="image-select-page">
      <h2 className="typing-text">배경으로 사용할 이미지 4개를 선택해 주세요</h2>
      <div className="slot-grid">
        {imageOptions.map((image) => (
          <div
            key={image.id}
            className={`slot ${selectedImages.includes(image.id) ? "selected" : ""}`}
            onClick={() => handleSelect(image.id)}
          >
            <img src={`/backgrounds/${image.src}`} width="80" height="60" alt="img" />
            <div className="slot-label">{image.id}</div>
          </div>
        ))}
      </div>
      <div className="selected-slots">
        {[0, 1, 2, 3].map((index) => {
          const imgId = selectedImages[index];
          const image = imageOptions.find((img) => img.id === imgId);
          return (
            <div key={index} className="preview-slot">
              {image ? (
                <img
                  src={`/backgrounds/${image.src}`}
                  width="120"
                  height="80"
                  alt="selected"
                />
              ) : (
                <div className="empty-slot">빈 슬롯</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="button-row">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
