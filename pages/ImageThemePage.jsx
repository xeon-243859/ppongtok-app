import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import styles from "./ImageThemePage.module.css"; 

const images = [
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
  "/backgrounds/cosmos.jpg"
];

const ImageThemePage = () => {
  const navigate = useNavigate();
  const [_, forceRerender] = useState(false); // 강제 리렌더링용

  const handleSelect = (src) => {
    for (let i = 1; i <= 4; i++) {
      if (!localStorage.getItem(`img-${i}`)) {
        localStorage.setItem(`img-${i}`, src);
        break;
      }
    }
    navigate("/image/select");
  };

  const handleRemove = (src) => {
    for (let i = 1; i <= 4; i++) {
      if (localStorage.getItem(`img-${i}`) === src) {
        localStorage.removeItem(`img-${i}`);
        break;
      }
    }
    forceRerender((prev) => !prev); // 상태 변경으로 강제 리렌더링
  };

  // 이미지가 이미 선택되어 있는지 확인
  const isSelected = (src) => {
    for (let i = 1; i <= 4; i++) {
      if (localStorage.getItem(`img-${i}`) === src) return true;
    }
    return false;
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
};

export default ImageThemePage;
