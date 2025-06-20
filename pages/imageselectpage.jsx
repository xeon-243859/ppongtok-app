import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression"; // ✅ 라이브러리 import
import styles from "./imageselectpage.module.css";
import appStyles from "../src/styles/AppTheme.module.css"; // ✅ 공통 스타일 import

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가

  // 기존 이미지 로드
  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= 4; i++) {
      loadedImages.push(localStorage.getItem(`img-${i}`) || "");
    }
    setImages(loadedImages);
  }, []);

  // ✅ 이미지 선택 및 압축 핸들러
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files).slice(0, 4 - images.filter(Boolean).length);
    if (files.length === 0) return;

    setIsLoading(true); // 로딩 시작
    alert(`이미지 압축을 시작합니다. 잠시만 기다려주세요...`);

    const updated = [...images];
    const compressionPromises = files.map(async (file) => {
      console.log(`압축 전: ${file.name}, ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      try {
        const options = {
          maxSizeMB: 1, // 최대 1MB
          maxWidthOrHeight: 1920, // 최대 해상도 1920px
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        console.log(`압축 후: ${compressedFile.name}, ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        return URL.createObjectURL(compressedFile);
      } catch (error) {
        console.error("이미지 압축 실패:", error);
        alert(`${file.name} 파일 압축에 실패했습니다. 다른 파일을 선택해주세요.`);
        return null;
      }
    });

    const compressedUrls = await Promise.all(compressionPromises);
    
    let currentImageIndex = 0;
    for (let i = 0; i < updated.length; i++) {
        if (!updated[i] && compressedUrls[currentImageIndex]) {
            updated[i] = compressedUrls[currentImageIndex];
            currentImageIndex++;
        }
    }

    setImages(updated);
    // localStorage에도 저장
    for (let i = 0; i < updated.length; i++) {
        if (updated[i]) localStorage.setItem(`img-${i + 1}`, updated[i]);
    }
    
    setIsLoading(false); // 로딩 종료
    e.target.value = null; // 같은 파일 다시 선택 가능하도록 초기화
  };

  const handleDelete = (index) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index]); // 메모리 해제
    updated[index] = "";
    setImages(updated);
    localStorage.removeItem(`img-${index + 1}`);
  };

  const handleNext = () => {
    const cleanedImages = images.filter(Boolean);
    if (cleanedImages.length === 0) {
      alert("최소 1장의 이미지를 선택해주세요.");
      return;
    }
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
    localStorage.setItem("allow-music", "true");
    // 모든 이미지를 배열로 저장
    localStorage.setItem("selected-images", JSON.stringify(cleanedImages));
    
    setTimeout(() => {
      router.push("/musicselectpage");
    }, 100);
  };
  
  const handleBack = () => router.push('/style-select');

  return (
    <div className={`${appStyles.pageContainer} ${styles.pageLayout}`}>
      <h2 className={appStyles.pageTitle}>배경 이미지를 선택해주세요</h2>
      <p className={appStyles.pageDescription}>최대 4장까지 선택할 수 있습니다.</p>

      <div className={styles.preview}>
        {images.map((url, index) => (
          <div key={index} className={styles["thumbnail-wrapper"]}>
            {url ? (
              <>
                <img src={url} className={styles.thumbnail} alt={`선택된 이미지 ${index + 1}`} />
                <button className={styles["delete-button"]} onClick={() => handleDelete(index)}>❌</button>
              </>
            ) : (
              <div className={styles.placeholder} onClick={() => fileInputRef.current.click()}>+</div>
            )}
          </div>
        ))}
      </div>
      
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={isLoading}
      />
      
      <button 
        onClick={() => fileInputRef.current.click()} 
        className={appStyles.buttonPrimary} 
        disabled={isLoading || images.filter(Boolean).length >= 4}
      >
        {isLoading ? "압축 중..." : "내 파일 선택"}
      </button>

      <div className={appStyles.navButtonContainer}>
        <button onClick={handleBack} className={appStyles.buttonSecondary}>뒤로가기</button>
        <button onClick={handleNext} className={appStyles.buttonPrimary}>다음으로</button>
      </div>
    </div>
  );
}