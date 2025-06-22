// ppongtok-app/pages/imageselectpage.jsx

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css";

// 로컬 스토리지에 저장할 영구적인 이미지 키
const getStorageKey = (index) => `selected_image_${index}`;
// 테마 페이지에서 전달받는 임시 키
const THEME_IMAGES_KEY = 'theme_images_to_add';

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  
  // 'images' 상태가 변경될 때마다 선택된 이미지 개수를 다시 계산합니다.
  const selectedImageCount = images.filter(Boolean).length;

  // [수정] 페이지 로드 시 로컬 스토리지 데이터 처리 로직 강화
  useEffect(() => {
    try {
      // 1. 먼저, 영구 저장된 이미지들을 불러옵니다.
      let currentImages = Array(4)
        .fill(null)
        .map((_, i) => localStorage.getItem(getStorageKey(i)));

      // 2. 'imagethemepage'에서 추가할 테마 이미지가 있는지 확인합니다.
      const themeImagesToAddJSON = localStorage.getItem(THEME_IMAGES_KEY);
      if (themeImagesToAddJSON) {
        const themeImagesToAdd = JSON.parse(themeImagesToAddJSON);
        let themeImageIndex = 0;

        // 3. 비어있는 슬롯에 테마 이미지를 순서대로 채워넣습니다.
        currentImages = currentImages.map((img, index) => {
          if (!img && themeImageIndex < themeImagesToAdd.length) {
            const newImageUrl = themeImagesToAdd[themeImageIndex++];
            // 새로 추가된 테마 이미지도 영구 저장소에 저장합니다.
            localStorage.setItem(getStorageKey(index), newImageUrl);
            return newImageUrl;
          }
          return img;
        });
        
        // 4. 처리가 끝났으므로 임시 키를 반드시 삭제합니다.
        localStorage.removeItem(THEME_IMAGES_KEY);
      }

      // 5. 최종적으로 완성된 이미지 배열로 상태를 업데이트합니다.
      setImages(currentImages);

    } catch (error) {
      console.error("로컬 스토리지 처리 중 오류 발생:", error);
      // 오류 발생 시 기존 로직을 비워 안전하게 처리
      localStorage.removeItem(THEME_IMAGES_KEY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 이 useEffect는 페이지 최초 로드 시 한 번만 실행되어야 합니다.

  // 이미지 선택 및 압축 처리 핸들러 (원본 유지)
  const handleImageSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 4 - selectedImageCount;
    if (availableSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, availableSlots);

    setIsLoading(true);
    alert("이미지 최적화를 시작합니다. 잠시만 기다려주세요...");

    const compressionPromises = filesToProcess.map(async (file) => {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
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
    e.target.value = null;
  };

  // 이미지 삭제 핸들러 (원본 유지)
  const handleDelete = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
    localStorage.removeItem(getStorageKey(index));
  };

  // 다음 페이지로 이동 (원본 유지 및 정상 작동)
  const handleNext = () => {
    if (selectedImageCount === 0) {
      alert("최소 1장의 이미지를 선택해주세요.");
      return;
    }
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");

    router.push("/musicselectpage");
  };

  const handleBack = () => router.push("/style-select");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* [수정] 화면 흔들림 방지를 위해 h1에 minHeight 스타일 추가 */}
        <h1 className={styles.title} style={{minHeight: '8rem'}}>
          <TypeAnimation
            sequence={[
              "어떤 배경으로\n마음을 전해볼까요?",
              2000,
              "최대 4장의 이미지를\n선택해주세요.",
            ]}
            wrapper="span"
            speed={50}
            cursor={true}
            style={{ 
              whiteSpace: "pre-line", 
              display: "inline-block",
            }}
            repeat={Infinity}
          />
        </h1>
        {/* [수정] '이미지 배경 선택' 멘트 삭제 */}

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
          disabled={selectedImageCount === 0} // 이제 정상적으로 작동합니다.
        >
          다음으로
        </button>
      </div>
    </div>
  );
}