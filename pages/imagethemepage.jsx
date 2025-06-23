// ppongtok-app/pages/imagethemepage.jsx (UI 구조 복원 및 로직 수정 완료)

import React from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/imagethemepage.module.css";

// 이미지 목록은 그대로 유지
const themeImages = [
  { id: 1, src: '/images/theme1.jpg', alt: '테마 이미지 1' },
  { id: 2, src: '/images/theme2.jpg', alt: '테마 이미지 2' },
  { id: 3, src: '/images/theme3.jpg', alt: '테마 이미지 3' },
  { id: 4, src: '/images/theme4.jpg', alt: '테마 이미지 4' },
  { id: 5, src: '/images/theme5.jpg', alt: '테마 이미지 5' },
  { id: 6, src: '/images/theme6.jpg', alt: '테마 이미지 6' },
  { id: 7, src: '/images/theme7.jpg', alt: '테마 이미지 7' },
  { id: 8, src: '/images/theme8.jpg', alt: '테마 이미지 8' },
];

// 이미지를 Base64로 변환하는 헬퍼 함수
const toBase64 = (url) =>
  fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));

export default function ImageThemePage() {
  const router = useRouter();

  // handleImageSelect 함수의 로직은 그대로 유지
  const handleImageSelect = async (imageSrc) => {
    try {
      const base64 = await toBase64(imageSrc);
      localStorage.setItem("newly_selected_theme_image", base64);
      router.push("/imageselectpage");
    } catch (error) {
      console.error("테마 이미지 변환 실패:", error);
      alert("이미지를 처리하는 데 오류가 발생했습니다.");
    }
  };

  // [수정] JSX 렌더링 구조를 원래의 안정적인 버전으로 복원합니다.
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>테마 이미지 선택</h1>
        <div className={styles.imageGrid}>
          {themeImages.map((image) => (
            <div
              key={image.id}
              className={styles.imageContainer}
              onClick={() => handleImageSelect(image.src)}
            >
              <img src={image.src} alt={image.alt} className={styles.image} />
            </div>
          ))}
        </div>
        <button className={styles.backButton} onClick={() => router.back()}>
          뒤로가기
        </button>
      </div>
    </div>
  );
}