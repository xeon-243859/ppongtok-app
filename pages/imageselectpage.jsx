import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./imageselectpage.module.css";

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["", "", "", ""]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    const updated = [...images];
    files.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      updated[index] = url;
      localStorage.setItem(`img-${index + 1}`, url);
    });
    setImages(updated);
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
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
    if (cleanedImages.length < 1) {
      alert("최소 1장의 이미지를 선택해주세요.");
      return;
    }
    for (let i = 0; i < 4; i++) {
      localStorage.setItem(`img-${i + 1}`, images[i] || "");
    }
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
    localStorage.setItem("allow-music", "true");
    setTimeout(() => {
      router.push("/musicselectpage");
    }, 100);
  };

  const handleThemeLibrary = () => {
    localStorage.setItem("last-image-page", "imageselectpage");
    router.push("/imagethemepage");
  };

  return (
    <div className={styles["image-select-page"]}>
      <h2 className={styles["title"]}>이미지를 선택해주세요</h2>

      <button onClick={handleThemeLibrary} className={styles["upload-button"]}>
        📁 이미지 테마 저장소 이동
      </button>

      <input	
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button onClick={() => fileInputRef.current.click()} className={styles["upload-button"]}>
        이미지 업로드
      </button>

      <div className={styles["preview"]}>
        {images.map((url, index) => (
          <div key={index} className={styles["thumbnail-wrapper"]}>
            {url && (
              <>
                <img
                  src={url}
                  className={styles["thumbnail"]}
                  alt={`img-${index + 1}`}
                />
                <button
                  className={styles["delete-button"]}
                  onClick={() => handleDelete(index)}
                >
                  ❌
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleNext} className={styles["next-button"]}>
        다음으로
      </button>
    </div>
  );
}
