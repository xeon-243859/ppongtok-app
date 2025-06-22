// ppongtok-app/pages/imageselectpage.jsx

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css";

// 로컬 스토리지 키 (상수로 관리하면 오타를 방지할 수 있습니다)
const getStorageKey = (index) => `selected_image_${index}`;
const THEME_IMAGES_KEY = 'theme_images_to_add';

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // useState의 초기값을 함수로 설정하여, 컴포넌트가 처음 렌더링될 때만 실행되도록 최적화
  const [images, setImages] = useState(() => {
    // 서버 사이드 렌더링 환경에서는 window 객체가 없으므로 방어 코드 추가
    if (typeof window === "undefined") {
      return Array(4).fill(null);
    }
    try {
      // 1. 기존에 영구 저장된 이미지를 불러옵니다.
      let initialImages = Array(4)
        .fill(null)
        .map((_, i) => localStorage.getItem(getStorageKey(i)));

      // 2. imagethemepage에서 온 임시 테마 이미지가 있는지 확인합니다.
      const themeImagesToAddJSON = localStorage.getItem(THEME_IMAGES_KEY);
      if (themeImagesToAddJSON) {
        const themeImagesToAdd = JSON.parse(themeImagesToAddJSON);
        let themeIndex = 0;
        
        // 3. 비어있는 슬롯에 테마 이미지를 채웁니다.
        initialImages = initialImages.map((img, i) => {
          if (!img && themeIndex < themeImagesToAdd.length) {
            const newThemeImage = themeImagesToAdd[themeIndex++];
            // 채운 이미지를 영구 저장소에도 반영합니다.
            localStorage.setItem(getStorageKey(i), newThemeImage);
            return newThemeImage;
          }
          return img;
        });

        // 4. 사용이 끝난 임시 데이터는 즉시 삭제합니다.
        localStorage.removeItem(THEME_IMAGES_KEY);
      }
      return initialImages;
    } catch (error) {
      console.error("초기 이미지 로딩 중 오류:", error);
      localStorage.removeItem(THEME_IMAGES_KEY); // 오류 발생 시 임시 데이터 정리
      return Array(4).fill(null);
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const selectedImageCount = images.filter(Boolean).length;

  // 파일 선택 및 압축 핸들러 (원본 구조 유지)
  const handleImageSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 4 - selectedImageCount;
    if (availableSlots <= 0) {
        alert("이미지는 최대 4장까지 선택할 수 있습니다.");
        return;
    }
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    setIsLoading(true);
    alert("이미지 최적화를 시작합니다. 잠시만 기다려주세요...");

    const compressionPromises = filesToProcess.map(async (file) => {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => resolve(reader.result);
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
        const url = compressedBase64s[base64Index++];
        newImages[i] = url;
        localStorage.setItem(getStorageKey(i), url);
      }
    }
    setImages(newImages);
    setIsLoading(false);
    e.target.value = null;
  };

  // 이미지 삭제 핸들러
  const handleDelete = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
    localStorage.removeItem(getStorageKey(index));
  };

  // 다음 페이지 이동 핸들러
  const handleNext = () => {
    if (selectedImageCount === 0) {
      alert("최소 1장의 이미지를 선택해주세요.");
      return;
    }
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
    router.push("/musicselectpage");
  };

  // 뒤로가기 핸들러
  const handleBack = () => router.push("/style-select");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title} style={{ minHeight: '8rem' }}>
          <TypeAnimation
            sequence={[
              "어떤 배경으로\n마음을 전해볼까요?",
              2000,
              "최대 4장의 이미지를\n선택해주세요.",
              4000, // [수정] 텍스트가 보이는 시간을 2초 -> 4초로 늘림
            ]}
            wrapper="span"
            speed={50}
            cursor={true}
            style={{ whiteSpace: "pre-line", display: "inline-block" }}
            repeat={Infinity}
          />
        </h1>

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
                  <img src={url} alt={`선택된 이미지 ${index + 1}`} className={styles.thumbnail} />
                  <button className={styles.deleteButton} onClick={() => handleDelete(index)}>×</button>
                </>
              ) : (
                <div
                  className={styles.placeholder}
                  onClick={() => !isLoading && selectedImageCount < 4 && fileInputRef.current?.click()}
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
          disabled={selectedImageCount === 0} // [수정] 이제 정상적으로 활성화/비활성화됩니다.
        >
          다음으로
        </button>
      </div>
    </div>
  );
}