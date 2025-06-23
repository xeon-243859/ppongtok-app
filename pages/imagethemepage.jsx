// ppongtok-app/pages/imagethemepage.jsx (Base64 변환 로직 추가)

import React from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/imagethemepage.module.css";

// (이미지 목록은 그대로 둡니다)
const themeImages = [
  // ...
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

  // [수정] handleImageSelect 함수
  const handleImageSelect = async (imageSrc) => {
    try {
      // 선택한 이미지 URL을 Base64 문자열로 변환
      const base64 = await toBase64(imageSrc);
      
      // newly_selected_theme_image 키에 Base64 데이터를 저장
      localStorage.setItem("newly_selected_theme_image", base64);
      
      // 이미지 선택 페이지로 돌아감
      router.push("/imageselectpage");
    } catch (error) {
      console.error("테마 이미지 변환 실패:", error);
      alert("이미지를 처리하는 데 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.pageContainer}>
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
  );
}