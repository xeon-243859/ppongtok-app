// ppongtok-app/pages/imagethemepage.jsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/ImageThemePage.module.css";

// 이 페이지에서 보여줄 테마 이미지 목록
const themeImages = [
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
  "/backgrounds/cosmos.jpg",
  // 필요하다면 더 많은 이미지 경로를 추가하세요.
  // "/backgrounds/image5.jpg",
  // "/backgrounds/image6.jpg",
];

export default function ImageThemePage() {
  const router = useRouter();
  
  // 사용자가 현재 선택한 이미지들의 URL을 배열로 관리하는 상태
  const [selectedUrls, setSelectedUrls] = useState([]);

  // 이미지 클릭 시 선택 목록에 추가하거나 제거하는 함수
  const handleToggleSelect = (src) => {
    setSelectedUrls((prevSelected) => {
      if (prevSelected.includes(src)) {
        // 이미 선택된 이미지라면, 목록에서 제거합니다.
        return prevSelected.filter(url => url !== src);
      } else {
        // 새로 선택하는 이미지라면, 목록에 추가합니다. (최대 4개 제한)
        if (prevSelected.length >= 4) {
          alert("이미지는 최대 4개까지만 선택할 수 있습니다.");
          return prevSelected; // 4개가 넘으면 추가하지 않고 기존 상태 유지
        }
        return [...prevSelected, src];
      }
    });
  };

  // '선택 완료' 버튼 클릭 시 실행될 최종 함수
  const handleConfirmAndGoBack = () => {
    // 1. 선택된 이미지가 없으면 사용자에게 알립니다.
    if (selectedUrls.length === 0) {
      alert('하나 이상의 테마 이미지를 선택해주세요.');
      return;
    }

    // 2. 'imageselectpage'와 약속된 임시 키('theme_images_to_add')로
    //    선택된 이미지 URL 배열(selectedUrls)을 로컬 스토리지에 저장합니다.
    localStorage.setItem('theme_images_to_add', JSON.stringify(selectedUrls));

    // 3. 모든 준비가 끝났으니, imageselectpage로 돌아갑니다.
    router.push("/imageselectpage");
  };

  return (
    <div className={styles["image-theme-page"]}>
      <h2 className={styles["image-theme-title"]}>이미지 테마 저장소</h2>
      <p className={styles["image-theme-subtitle"]}>
        배경으로 사용할 이미지를 선택해주세요. (현재 {selectedUrls.length} / 4 개 선택)
      </p>
      
      <div className={styles["image-grid"]}>
        {themeImages.map((src) => {
          // 현재 이미지가 선택되었는지 여부를 확인합니다.
          const isSelected = selectedUrls.includes(src);
          
          return (
            <div
              key={src}
              // 선택 여부에 따라 다른 CSS 클래스를 적용하여 시각적 효과를 줍니다.
              className={`${styles["thumbnail"]} ${isSelected ? styles["selected"] : ""}`}
              // 이미지를 클릭하면 선택/해제 로직이 실행됩니다.
              onClick={() => handleToggleSelect(src)}
            >
              <img src={src} alt="테마 이미지" />
              {/* 선택된 이미지 위에 체크마크 표시 */}
              {isSelected && (
                <div className={styles["checkmark-overlay"]}>
                  ✔
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 네비게이션 버튼 영역 */}
      <div className={styles["navigation-buttons"]}>
        <button 
          className={styles["button"]}
          onClick={() => router.push("/imageselectpage")}
        >
          취소
        </button>
        <button 
          className={`${styles["button"]} ${styles["confirm-button"]}`}
          onClick={handleConfirmAndGoBack}
          // 선택된 이미지가 없으면 버튼을 비활성화합니다.
          disabled={selectedUrls.length === 0}
        >
          선택 완료 ({selectedUrls.length}개)
        </button>
      </div>
    </div>
  );
}