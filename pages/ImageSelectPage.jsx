// ✅ 수정: ImageSelectPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ImageSelectPage.module.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["/images/leaves.jpg", "/images/road.jpg"]);

  

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));

    localStorage.setItem("selectedImages", JSON.stringify(urls));
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selectedVideo");

    setImages(urls); // 상태 저장 (선택사항)
  };

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
  console.log("🔥 images 상태", images);
  images.forEach((img, i) => {
  console.log(`📦 image[${i}]`, img);
  console.log(`👉 image[${i}] instanceof File ?`, img instanceof File);
});

  // ✅ 영상 흔적 제거
  localStorage.removeItem("selected-video");
  localStorage.setItem("selected-type", "image");

  const cleanedImages = images.filter(Boolean); // null, 빈 값 제거
localStorage.setItem("selectedImages", JSON.stringify(cleanedImages));
localStorage.setItem("selected-type", "image");
localStorage.removeItem("selected-video");
localStorage.setItem("allow-music", "true");

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
  <div className={styles["image-select-container"]}>
    <div className={styles["typing-text"]}>
      <div className={styles["line1"]}>배경으로 사용할 이미지 4개를</div>
      <div className={styles["line2"]}>선택해 주세요</div>
    </div>

    <div className={styles["file-button-group"]}>
      <button onClick={handleImageFile}>배경이미지 파일</button>

      <label htmlFor="local-file" style={{ 
        backgroundColor: "#fcdede",
        padding: "10px 18px",
        borderRadius: "20px",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
        marginLeft: "12px"
      }}>
        내 파일 선택
      </label>

      <input
        id="local-file"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        style={{ display: "none" }}
      />
    </div>

    <div className={styles["image-slots-grid"]}>
      {images.map((src, i) => (
        <div className={styles["image-slot"]} key={i}>
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
              <button
                className={styles["delete-button"]}
                onClick={() => handleDelete(i)}
              >
                ❌
              </button>
            </>
          ) : (
            <p>{`img-${i + 1}`}</p>
          )}
        </div>
      ))}
    </div>

    <div className={styles["button-group"]}>
      <button onClick={() => window.location.replace("/style/select")}>
        뒤로가기
      </button>
      <button onClick={handleNext}>다음으로</button>
    </div>
  </div>
);

};

export default ImageSelectPage;
