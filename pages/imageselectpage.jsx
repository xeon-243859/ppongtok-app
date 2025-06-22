// ppongtok-app/pages/imageselectpage.jsx

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css"; // CSS 모듈 import

// 로컬 스토리지에 저장할 이미지 키
const getStorageKey = (index) => `selected_image_${index}`;

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const selectedImageCount = images.filter(Boolean).length;

  // 페이지 로드 시 로컬 스토리지에서 이미지 불러오기
  useEffect(() => {
    try {
      const loadedImages = Array(4)
        .fill(null)
        .map((_, i) => localStorage.getItem(getStorageKey(i)));
      setImages(loadedImages);
    } catch (error) {
      console.error("로컬 스토리지 접근 중 오류 발생:", error);
    }
  }, []);

  // 이미지 선택 및 압축 처리 핸들러
  const handleImageSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 4 - selectedImageCount;
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    setIsLoading(true);
    alert("이미지 최적화를 시작합니다. 잠시만 기다려주세요...");

    const compressionPromises = filesToProcess.map(async (file) => {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        // Blob을 Base64로 변환하여 로컬 스토리지에 저장 (URL.createObjectURL의 휘발성 문제 해결)
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
        });
      } catch (error) {
        console.error("이미지 압축 실패:", error);
        return null;
      }
    });

    const compressedBase64s = (await Promise.all(compressionPromises)).filter(Boolean);
    const newImages = [...images];
    let base64Index = 0;

    for (let i = 0; i < newImages.length && base64Index < compressedBase64s.length; i++) {
      if (!newImages[i]) {
        const base64Url = compressedBase64s[base64Index++];
        newImages[i] = base64Url;
        localStorage.setItem(getStorageKey(i), base64Url);
      }
    }

    setImages(newImages);
    setIsLoading(false);
    e.target.value = null; // 같은 파일 다시 선택 가능하도록 초기화
  };

  // 이미지 삭제 핸들러
  const handleDelete = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
    localStorage.removeItem(getStorageKey(index));
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    const selectedImages = images.filter(Boolean);
    if (selectedImages.length === 0) {
      alert("최소 1장의 이미지를 선택해주세요.");
      return;
    }
    // 다음 페이지를 위해 로컬 스토리지 설정
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video"); // 비디오 선택값은 삭제

    router.push("/musicselectpage");
  };

  const handleBack = () => router.push("/style-select");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          <TypeAnimation
            sequence={[
              "어떤 배경으로\n마음을 전해볼까요?",
              2000,
              "최대 4장의 이미지를\n선택해주세요.",
            ]}
            wrapper="span"
            speed={50}
            cursor={true}
            style={{ whiteSpace: "pre-line", display: "inline-block" }}
            repeat={Infinity}
          />
        </h1>
        <p className={styles.subtitle}>이미지 배경 선택</p>

        <div className={styles.buttonGroup}>
          <button
            className={styles.button}
            onClick={() => router.push("/imagethemepage")}
          >
            테마 이미지 선택
          </button>
          <button
            className={styles.button}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || selectedImageCount >= 4}
          >
            {isLoading ? "업로드 중..." : "내 파일 선택"}
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />

        <div className={styles.previewGrid}>
          {images.map((url, index) => (
            <div key={index} className={styles.slot}>
              {url ? (
                <>
                  <img
                    src={url}
                    alt={`선택된 이미지 ${index + 1}`}
                    className={styles.thumbnail}
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(index)}
                  >
                    ×
                  </button>
                </>
              ) : (
                <div
                  className={styles.placeholder}
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                >
                  <span className={styles.plusIcon}>+</span>
                  <span>이미지 추가</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.navButtonContainer}>
        <button onClick={handleBack} className={`${styles.button} ${styles.navButton}`}>
          뒤로가기
        </button>
        <button
          onClick={handleNext}
          className={`${styles.button} ${styles.navButton} ${styles.buttonPrimary}`}
          disabled={selectedImageCount === 0}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}