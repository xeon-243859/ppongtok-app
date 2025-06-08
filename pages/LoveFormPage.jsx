import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./LoveFormPage.module.css";

export default function LoveFormPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleNext = () => {
    if (!message.trim()) {
      alert("메시지를 입력해주세요.");
      return;
    }

    localStorage.setItem("message", message);
    router.push("/style/select");
  };

  return (
    <div className={styles["love-form-container"]}>
      <h2 className={styles["form-title-line1"]}>나의 깊은 속마음을</h2>
      <h2 className={styles["form-title-line2"]}>남겨보세요</h2>

      <textarea
        className={styles["message-input"]}
        placeholder="시작하기 - 메시지입력 - 이미지 or 영상선택 - 음원선택 - 완성"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className={styles["next-button"]} onClick={handleNext}>
        다음으로
      </button>
    </div>
  );
}
