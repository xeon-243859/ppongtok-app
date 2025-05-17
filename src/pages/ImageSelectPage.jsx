// ✅ 수정: ImageSelectPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["", "", "", ""]);

  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= 4; i++) {
      loadedImages.push(localStorage.getItem(`img-${i}`) || "");
    }
    setImages(loadedImages);
  }, []);

  const handleDelete = (index) => {
    const updated = [...images];
    updated[index] = "";
    setImages(updated);
    localStorage.removeItem(`img-${index + 1}`);
  };

  const handleNext = () => {
    // ✅ 영상 관련 localStorage 흔적 완전 제거
    localStorage.removeItem("selected-video");
    localStorage.setItem("selected-type", "image");

    const selectedImages = images.filter((img) => img);
    localStorage.setItem("selected-images", JSON.stringify(selectedImages));
    localStorage.setItem("allow-music", "true"); // ✅ 음악 페이지 진입 허용

    setTimeout(() => {
      navigate("/music/select");
    }, 100);
  };

  const saveImage = (dataUrl) => {
    const updated = [...images];
    for (let i = 0; i < 4; i++) {
      if (!updated[i]) {
        updated[i] = dataUrl;
        setImages(updated);
        localStorage.setItem(`img-${i + 1}`, dataUrl);
        return;
      }
    }
    alert("모든 슬롯이 가득 찼어요!");
  };

  const handleImageFile = () => {
    navigate("/image/theme");
  };

  const handleLocalFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      saveImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-select-container">
      <div className="typing-text">
        <div className="line1">배경으로 사용할 이미지 4개를</div>
        <div className="line2">선택해 주세요</div>
      </div>

      <div className="file-button-group">
        <button onClick={handleImageFile}>배경이미지 파일</button>
        <button onClick={handleLocalFile}>내 파일 선택</button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="image-slots-grid">
        {images.map((src, i) => (
          <div className="image-slot" key={i}>
            {src ? (
              <>
                <img
                  src={
                    src.includes("/backgrounds/")
                      ? src
                      : `data:image/jpeg;base64,${src}`
                  }
                  alt={`img-${i + 1}`}
                />
                <button className="delete-button" onClick={() => handleDelete(i)}>
                  ❌
                </button>
              </>
            ) : (
              <p>{`img-${i + 1}`}</p>
            )}
          </div>
        ))}
      </div>

      <div className="button-group">
         <button
    onClick={() => {
      window.location.replace("/style/select");
    }}
  >
    뒤로가기
  </button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
