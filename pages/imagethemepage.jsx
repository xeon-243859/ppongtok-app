// ppongtok-app/pages/imagethemepage.jsx (실제 파일 경로로 수정 완료)

import React from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/imagethemepage.module.css";

// [수정] Xeon님의 실제 이미지 파일 목록으로 교체
const themeImages = [
  { id: 1, src: '/images/cosmos.jpg', alt: '코스모스' },
  { id: 2, src: '/images/leaves.jpg', alt: '나뭇잎' },
  { id: 3, src: '/images/road.jpg', alt: '길' },
  { id: 4, src: '/images/water.jpg', alt: '물' },
  // 만약 이미지가 더 있다면 아래 형식에 맞춰 추가하시면 됩니다.
  // { id: 5, src: '/images/another_image.jpg', alt: '다른 이미지' },
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