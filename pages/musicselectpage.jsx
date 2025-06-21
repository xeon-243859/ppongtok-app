// ppongtok-app/pages/imageselectpage.jsx

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import pageStyles from "../src/styles/ImageSelectPage.module.css"; 

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadedImages = Array(4).fill(null);
    for (let i = 0; i < 4; i++) {
      const storedImage = localStorage.getItem(`img-${i + 1}`);
      if (storedImage) loadedImages[i] = storedImage;
    }
    setImages(loadedImages);
  }, []);

  const handleImageSelect = async (e) => {
    const emptySlots = images.filter(img => !img).length;
    const filesToProcess = Array.from(e.target.files).slice(0, emptySlots);
    if (filesToProcess.length === 0) return;

    setIsLoading(true);
    const compressionPromises = filesToProcess.map(async (file) => {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        return { url: URL.createObjectURL(compressedFile) };
      } catch (error) { return null; }
    });

    const compressedResults = await Promise.all(compressionPromises);
    const newImages = [...images];
    let compressedIndex = 0;
    for (let i = 0; i < newImages.length; i++) {
        if (!newImages[i] && compressedResults[compressedIndex]) {
            newImages[i] = compressedResults[compressedIndex].url;
            localStorage.setItem(`img-${i + 1}`, newImages[i]);
            compressedIndex++;
        }
    }
    setImages(newImages);
    setIsLoading(false);
    e.target.value = null;
  };

  const handleDelete = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index]);
    updatedImages[index] = null;
    setImages(updatedImages);
    localStorage.removeItem(`img-${index + 1}`);
  };

  const handleNext = () => {
    const selectedImages = images.filter(Boolean);
    if (selectedImages.length === 0) { alert("최소 1장의 이미지를 선택해주세요."); return; }
    localStorage.setItem("selected-type", "image");
    localStorage.setItem("allow-music", "true");
    router.push("/musicselectpage");
  };

  const handleBack = () => router.push('/style-select');
  const selectedImageCount = images.filter(Boolean).length;

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.contentWrapper}>
        <h2 className={pageStyles.title}>
          <TypeAnimation sequence={["배경으로 사용할 이미지를\n선택해 주세요"]} wrapper="span" cursor={false} />
        </h2>

        <div className={pageStyles.buttonGroup}>
          <button className={pageStyles.unifiedButton} onClick={() => router.push('/imagethemepage')}>테마 이미지</button>
          <button 
            className={pageStyles.unifiedButton}
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading || selectedImageCount >= 4}
          >
            {isLoading ? "처리 중..." : "내 파일 선택"}
          </button>
        </div>

        <input type="file" accept="image/*" multiple onChange={handleImageSelect} ref={fileInputRef} style={{ display: "none" }} />
        
        <div className={pageStyles.previewGrid}>
          {images.map((url, index) => (
            <div key={index} className={pageStyles.slot}>
              {url ? (
                <>
                  <img src={url} alt={`선택된 이미지 ${index + 1}`} className={pageStyles.thumbnail} />
                  <button className={pageStyles.deleteButton} onClick={() => handleDelete(index)}>×</button>
                </>
              ) : (
                <div className={pageStyles.placeholder} onClick={() => !isLoading && fileInputRef.current.click()}>+</div>
              )}
            </div>
          ))}
        </div>

        <div className={pageStyles.navButtonContainer}>
          <button onClick={handleBack} className={pageStyles.unifiedButton}>뒤로가기</button>
          <button onClick={handleNext} className={pageStyles.unifiedButton}>다음으로</button>
        </div>
      </div>
    </div>
  );
}