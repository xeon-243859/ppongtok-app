import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./imagebackgroundpage.module.css";

const images = [
  '/backgrounds/cosmos.jpg',
  '/backgrounds/leaves.jpg',
  '/backgrounds/road.jpg',
  '/backgrounds/water.jpg'
];

export default function ImageBackgroundPage({ setSelectedImage }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const handleSelect = (imgPath) => {
    fetch(imgPath)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;

          // ✅ base64 저장
          if (typeof window !== "undefined") {
            localStorage.setItem("selectedImage", base64Image);
          }

          // ✅ 상태 업데이트
          setSelected(imgPath);
          if (setSelectedImage) setSelectedImage(base64Image);
        };
        reader.readAsDataURL(blob);
      });
  };

  return (
    <div className={styles["image-background-container"]}>
      <h2>이미지 배경을 선택해 주세요</h2>
      <div className={styles["image-options"]}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`bg-${index}`}
            className={selected === img ? styles.selected : ""}
            onClick={() => handleSelect(img)}
          />
        ))}
      </div>
      <div className={styles["navigation-buttons"]}>
        <button onClick={() => router.push('/love/style')}>뒤로가기</button>
        <button onClick={() => router.push('/love/music')} disabled={!selected}>다음으로</button>
      </div>
    </div>
  );
}
