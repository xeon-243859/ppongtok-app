import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/imagethemepage.module.css";

const images = [
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
  "/backgrounds/cosmos.jpg"
];

export default function ImageThemePage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);
  const [_, forceRerender] = useState(false); // 강제 리렌더링용

  // 클라이언트 사이드에서만 localStorage 접근
  useEffect(() => {
    if (typeof window !== "undefined") {
      const current = [];
      for (let i = 1; i <= 4; i++) {
        const stored = localStorage.getItem(`img-${i}`);
        if (stored) current.push(stored);
      }
      setSelectedImages(current);
    }
  }, [_]);

  const handleSelect = (src) => {
    if (typeof window === "undefined") return;

    for (let i = 1; i <= 4; i++) {
      if (!localStorage.getItem(`img-${i}`)) {
        localStorage.setItem(`img-${i}`, src);
        break;
      }
    }

    forceRerender((prev) => !prev); // 상태 갱신
    router.push("/image/select");
  };

  const handleRemove = (src) => {
    if (typeof window === "undefined") return;

    for (let i = 1; i <= 4; i++) {
      if (localStorage.getItem(`img-${i}`) === src) {
        localStorage.removeItem(`img-${i}`);
        break;
      }
    }

    forceRerender((prev) => !prev);
  };

  const isSelected = (src) => {
    return selectedImages.includes(src);
  };

  return (
    <div className={styles["image-theme-page"]}>
      <h2 className={styles["image-theme-title"]}>이미지 테마 저장소</h2>
      <div className={styles["image-grid"]}>
        {images.map((src) => (
          <div key={src} className={styles["thumbnail"]}>
            <img src={src} alt="thumb" onClick={() => handleSelect(src)} />
            {isSelected(src) && (
              <button
                className={styles["remove-button"]}
                onClick={() => handleRemove(src)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
