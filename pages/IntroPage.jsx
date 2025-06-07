import React from "react";
import { useRouter } from "next/router";
import styles from "./IntroPage.module.css";

export default function IntroPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/select-category");
  };

  return (
    <div className={styles["intro-container"]}>
      <img
        src="/images/heart-effect.png"
        alt="하트 뿅 효과"
        className={styles["intro-image"]}
      />

      <div className={styles["intro-text"]}>
        <p className={styles["intro-title-line1"]}>뿅!톡</p>
        <p className={styles["intro-title-line2"]}>환영합니다</p>
        <p className={styles["philosophy-quote"]}>
          추억을 만들며 사랑을 고백하고,<br />
          축하하고, 또 잘못한 일은 사과하고,<br />
          감사하며 사는 인생.
        </p>
      </div>

      <button className={styles["start-button"]} onClick={handleStart}>
        시작하기
      </button>

      <p className={styles["app-slogan"]}>for love, for courage, for memories.</p>
      <p className={styles["app-credit"]}>by boribori & Xeon</p>
    </div>
  );
}
