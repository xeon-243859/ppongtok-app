// ppongtok-app/pages/imagethemepage.jsx

import React from "react";
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

  // [핵심 변경] 이미지를 클릭하면 실행되는 함수
  const handleSelectAndGoBack = (src) => {
    // 1. 사용자가 선택한 이미지의 주소(src)를 임시 키에 저장합니다.
    localStorage.setItem('newly_selected_theme_image', src);

    // 2. 즉시 imageselectpage로 돌아갑니다.
    router.push("/imageselectpage");
  };

  return (
    <div className={styles["image-theme-page"]}>
      <h2 className={styles["image-theme-title"]}>이미지 테마 저장소</h2>
      <p className={styles["image-theme-subtitle"]}>
        배경으로 사용할 이미지를 클릭하세요.
      </p>
      
      <div className={styles["image-grid"]}>
        {themeImages.map((src) => (
            <div
              key={src}
              className={styles["thumbnail"]}
              // 이미지를 클릭하면 handleSelectAndGoBack 함수가 실행됩니다.
              onClick={() => handleSelectAndGoBack(src)}
            >
              <img src={src} alt="테마 이미지" />
            </div>
        ))}
      </div>

      {/* 하단 네비게이션 버튼 영역 - '선택 완료' 버튼이 없어졌습니다. */}
      <div className={styles["navigation-buttons"]}>
        <button 
          className={styles["button"]}
          // '취소'는 아무것도 선택하지 않고 그냥 돌아갑니다.
          onClick={() => router.push("/imageselectpage")}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}