// ppongtok-app/pages/imageselectpage.jsx

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation"; // ✅ 타이핑 애니메이션 라이브러리 import

// ✅ 공통 스타일과 페이지 전용 스타일을 모두 import 합니다.
import appStyles from "../src/styles/AppTheme.module.css";
import pageStyles from "../src/styles/ImageSelectPage.module.css";

export default function ImageSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // ✅ 이미지 URL들을 담을 배열 상태 (최대 4개)
  const [images, setImages] = useState(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  // 페이지 로드 시 localStorage에서 기존 이미지 불러오기
  useEffect(() => {
    const loadedImages = Array(4).fill(null);
    for (let i = 0; i < 4; i++) {
      const storedImage = localStorage.getItem(`img-${i + 1}`);
      if (storedImage) {
        loadedImages[i] = storedImage;
      }
    }
    setImages(loadedImages);
  }, []);

  // 이미지 선택 및 압축 핸들러
  const handleImageSelect = async (e) => {
    // 현재 비어있는 슬롯의 개수만큼만 파일을 받습니다.
    const emptySlots = images.filter(img => !img).length;
    const filesToProcess = Array.from(e.target.files).slice(0, emptySlots);
    if (filesToProcess.length === 0) return;

    setIsLoading(true);
    alert(`이미지 압축을 시작합니다. 잠시만 기다려주세요...`);

    const compressionPromises = filesToProcess.map(async (file) => {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        return { file: compressedFile, url: URL.createObjectURL(compressedFile) };
      } catch (error) {
        console.error("이미지 압축 실패:", error);
        return null;
      }
    });

    const compressedResults = await Promise.all(compressionPromises);
    
    // 비어있는 슬롯에 순서대로 이미지를 채워넣습니다.
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
    e.target.value = null; // 같은 파일 다시 선택 가능하도록 초기화
  };

  // 특정 이미지 삭제 핸들러
  const handleDelete = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index]);
    updatedImages[index] = null;
    setImages(updatedImages);
    localStorage.removeItem(`img-${index + 1}`);
  };

  // '다음으로' 버튼 클릭 핸들러
  const handleNext = () => {
    const selectedImages = images.filter(Boolean);
    if (selectedImages.length === 0) {
      alert("최소 1장의 이미지를 선택해주세요.");
      return;
    }
    localStorage.setItem("selected-type", "image");
    localStorage.removeItem("selected-video");
    localStorage.setItem("allow-music", "true");
    
    // 최신 이미지 목록을 JSON 문자열로 저장 (추후 슬라이드쇼에서 사용)
    localStorage.setItem("selected-images", JSON.stringify(selectedImages));
    
    router.push("/musicselectpage");
  };

  const handleBack = () => router.push('/style-select');
  
  const selectedImageCount = images.filter(Boolean).length;

  return (
    <div className={appStyles.pageContainer}>
      {/* ✅ 타이핑 애니메이션 제목 */}
      <h2 className={appStyles.pageTitle} style={{ height: '80px' }}>
        <TypeAnimation
          sequence={[
            "배경으로 사용할 이미지를",
            1000,
            "배경으로 사용할 이미지를\n선택해 주세요",
          ]}
          wrapper="span"
          speed={50}
          cursor={true}
          style={{ whiteSpace: 'pre-line' }} // 줄바꿈(\n)을 인식하게 함
        />
      </h2>

      {/* ✅ 버튼 그룹 */}
      <div className={pageStyles.buttonGroup}>
        <button className={appStyles.buttonPrimary} onClick={() => router.push('/imagethemepage')}>
          테마 이미지
        </button>
        <button 
          className={appStyles.buttonPrimary} 
          onClick={() => fileInputRef.current.click()}
          disabled={isLoading || selectedImageCount >= 4}
        >
          {isLoading ? "처리 중..." : "내 파일 선택"}
        </button>
      </div>
      <p className={appStyles.pageDescription}>{`선택된 이미지: ${selectedImageCount} / 4`}</p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      
      {/* ✅ 빈 슬롯 4개 */}
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

      {/* ✅ 뒤로가기 / 다음으로 버튼 */}
      <div className={appStyles.navButtonContainer}>
        <button onClick={handleBack} className={appStyles.buttonSecondary}>뒤로가기</button>
        <button onClick={handleNext} className={appStyles.buttonPrimary}>다음으로</button>
      </div>
    </div>
  );
}