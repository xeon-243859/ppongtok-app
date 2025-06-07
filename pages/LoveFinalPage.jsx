import React from "react";
import { useRouter } from "next/router";
import styles from "./LoveFinalPage.module.css";

export default function LoveFinalPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className={styles["final-page-container"]}>
      <h1>💕 사랑의 메시지가 완성되었습니다! 💕</h1>
      <p>
        당신의 마음이 전해졌어요.
        <br />
        따뜻한 사랑이 누군가의 하루를 밝혀줄 거예요.
      </p>
      <button className={styles["go-home-button"]} onClick={handleGoHome}>
        처음으로
      </button>
    </div>
  );
}
