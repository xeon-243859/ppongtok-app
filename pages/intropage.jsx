// pages/intro.jsx
import { useRouter } from "next/router";
import styles from "./introPage.module.css"; // 경로는 실제 CSS 위치에 맞게 조정

export default function IntroPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/select-category"); // 다음 페이지 경로
  };

  return (
    <div className={styles["intro-container"]}>
      {/* 상단 하트 + 뿅 효과 이미지 */}
      <img
        src="/images/heart-effect.png"
        alt="하트 뿅 효과"
        className={styles["intro-image"]}
      />

      {/* 텍스트 영역 */}
      <div className={styles["intro-text"]}>
        <p className={styles["intro-title-line1"]}>뿅!톡</p>
        <p className={styles["intro-title-line2"]}>환영합니다</p>
        <p className={styles["philosophy-quote"]}>
          추억을 만들며 사랑을 고백하고,<br />
          축하하고, 또 잘못한 일은 사과하고,<br />
          감사하며 사는 인생.
        </p>
      </div>

      {/* 시작하기 버튼 */}
      <button className={styles["start-button"]} onClick={handleStart}>
        시작하기
      </button>
      <p className={styles["app-slogan"]}>for love, for courage, for memories.</p>
      <p className={styles["app-credit"]}>by boribori & Xeon</p>
    </div>
  );
}
