import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // ✅ react-router-dom → next/router
import styles from "@/styles/WriteMessagePage.module.css"; // ✅ 모듈 CSS 적용

const categoryMap = {
  memory: "추억 만들기",
  confess: "사랑 고백",
  celebrate: "축하하기",
  apology: "사과하기",
  thanks: "감사하기",
};

export default function WriteMessagePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");

  useEffect(() => {
    const categoryId = localStorage.getItem("selectedCategory");
    setCategoryLabel(categoryMap[categoryId] || "카테고리 없음");
  }, []);

  const handleNext = () => {
    localStorage.setItem("message", message);
    router.push("/style/select");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>깊은 속마음을 살며시 남겨보세요</h2>
      <p className={styles.categoryLabel}>[{categoryLabel}]</p>

      <textarea
        className={styles.messageInput}
        placeholder="시작하기 - 메시지입력 - 이미지 or 영상선택 - 음원선택 - 완성"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
      />

      <button className={styles.nextButton} onClick={handleNext}>
        다음으로
      </button>
    </div>
  );
}
