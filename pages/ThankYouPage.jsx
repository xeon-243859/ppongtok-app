import React from "react";
import styles from "@/styles/ThankYouPage.module.css";

export default function ThankYouPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🌼 감사의 마음을 전해볼까요?</h1>
      <p className={styles.subtitle}>
        고마운 마음을 따뜻하게 담아 소중한 사람에게 전하세요.
      </p>
      <button
        className={styles.button}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#9ccc65")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#aed581")
        }
      >
        메시지 작성하기 ✍️
      </button>
    </div>
  );
}
