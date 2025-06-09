import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./imageselectpage.module.css";

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["", "", "", ""]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    localStorage.setItem("selectedImages", JSON.stringify(urls));
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selectedVideo");
    setImages(urls);
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
    const cleanedImages = images.filter(Boolean);
    localStorage.removeItem("selected-video");
    localStorage.setItem("selected-type", "image");
    localStorage.setItem("selectedImages", JSON.stringify(cleanedImages));
    localStorage.setItem("allow-music", "true");
    setTimeout(() => {
      router.push("/music/select");
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
    router.push("/imagethemepage");
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

    <div className={styles.selectButtons}>
      <button onClick={handleImageFile}>배경이미지 파일</button>
      <label htmlFor="local-file">내 파일 선택</label>
      <input
         type="file"
         id="local-file"
         accept="image/*"
         multiple
         style={{ display: "none" }}
         onChange={handleFileUpload}
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
      <button onClick={() => router.push("/style/select")}>뒤로가기</button>
      <button onClick={handleNext}>다음으로</button>
    </div>
  </div>
);

}