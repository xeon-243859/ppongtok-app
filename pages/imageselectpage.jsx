// ppongtok-app/pages/imageselectpage.jsx (개선 제안)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import pageStyles from "../src/styles/imageselectpage.module.css";

// ✅ 로컬 스토리지 키를 관리하는 헬퍼 함수
const getStorageKey = (index) => `img-${index + 1}`;

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [images, setImages] = useState(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadedImages = Array(4).fill(null).map((_, i) => {
      return localStorage.getItem(getStorageKey(i));
    });
    setImages(loadedImages);
  }, []);

  const handleImageSelect = async (e) => {
    const emptySlots = images.filter(img => !img).length;
    const filesToProcess = Array.from(e.target.files).slice(0, emptySlots);
    if (filesToProcess.length === 0) return;

    setIsLoading(true);
    alert(`이미지 압축을 시작합니다. 잠시만 기다려주세요...`);

    const compressionPromises = filesToProcess.map(async (file) => {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        return URL.createObjectURL(compressedFile);
      } catch (error) {
        console.error("이미지 압축 실패:", error);
        return null;
      }
    });

    const compressedUrls = (await Promise.all(compressionPromises)).filter(Boolean);
    
    const newImages = [...images];
    let urlIndex = 0;
    for (let i = 0; i < newImages.length && urlIndex < compressedUrls.length; i++) {
        if (!newImages[i]) {
            const url = compressedUrls[urlIndex];
            newImages[i] = url;
            localStorage.setItem(getStorageKey(i), url);
            urlIndex++;
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
    localStorage.removeItem(getStorageKey(index));
  };
  
  // ✅ 로컬 스토리지 설정을 별도 함수로 분리
  const setupLocalStorageForNextPage = (selectedImages) => {
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
    localStorage.setItem("allow-music", "true");
    localStorage.setItem("selected-images", JSON.stringify(selectedImages));
  };

  const handleNext = () => {
    const selectedImages = images.filter(Boolean);
    if (selectedImages.length === 0) {
      alert("최소 1장의 이미지를 선택해주세요.");
      return;
    }
    setupLocalStorageForNextPage(selectedImages);
    router.push("/musicselectpage");
  };

  const handleBack = () => router.push('/style-select');
  
  const selectedImageCount = images.filter(Boolean).length;

  return (
    // ... JSX는 동일합니다 ...
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.contentWrapper}>
        <h2 className={pageStyles.title}>
          <TypeAnimation
            sequence={[ "배경으로 사용할 이미지를", 1000, "배경으로 사용할 이미지를\n선택해 주세요" ]}
            wrapper="span" speed={50} cursor={true} style={{ whiteSpace: 'pre-line' }}
          />
        </h2>

        <div className={pageStyles.buttonGroup}>
          <button className={pageStyles.button} onClick={() => router.push('/imagethemepage')}>
            테마 이미지
          </button>
          <button 
             className={`${pageStyles.button} ${pageStyles.buttonAccent}`} // ✅ 강조 버튼 클래스명 변경
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
                <div className={pageStyles.placeholder} onClick={() => !isLoading && fileInputRef.current.click()}>
                  +
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={pageStyles.navButtonContainer}>
         <button onClick={handleBack} className={`${pageStyles.button} ${pageStyles.buttonSecondary}`}>뒤로가기</button>
         <button onClick={handleNext} className={pageStyles.button}>다음으로</button>
      </div>
    </div>
  );
}