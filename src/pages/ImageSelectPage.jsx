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

  const saveImage = (dataUrl) => {
    const updated = [...images];
    for (let i = 0; i < 4; i++) {
      if (!updated[i]) {
        updated[i] = dataUrl;
        setImages(updated);
        localStorage.setItem(`img-${i + 1}`, dataUrl);
        localStorage.removeItem("selected-video");
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
      <h2 className="image-select-title">
        배경으로 사용할 이미지 4개를<br />선택해주세요
      </h2>

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
                <button className="delete-button" onClick={() => handleDelete(i)}>❌</button>
              </>
            ) : (
              <p>{`img-${i + 1}`}</p>
            )}
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/music/image")}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
