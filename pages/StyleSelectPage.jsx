import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter
import styles from "../src/styles/StyleSelectPage.module.css";

export default function StyleSelectPage() {
  const router = useRouter();
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 300);
    const timer2 = setTimeout(() => setShowLine2(true), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleImageClick = () => {
    router.push("/image/select");
  };

  const handleVideoClick = () => {
    router.push("/prepare-video");
  };

  return (
    <div className={styles.styleSelectContainer}>
      {showLine1 && <h2 className={styles.styleTitleLine1}>어떤 배경으로</h2>}
      {showLine2 && (
        <h2 className={styles.styleTitleLine2}>깊은 속마음을 담아볼까요?</h2>
      )}

      <div className={styles.styleButtonGroup}>
        <button onClick={handleImageClick}>이미지 배경 선택</button>
        <button onClick={handleVideoClick}>영상 배경 선택</button>
      </div>

      <button
        className={styles.backButton}
        onClick={() => {
          window.location.replace("/write/message"); // ✅ 그대로 유지
        }}
      >
        뒤로가기
      </button>
    </div>
  );
}
