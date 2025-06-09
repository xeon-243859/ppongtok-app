import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/AuthContext";
import styles from "./CategorySelectPage.module.css";

const categories = [
  { label: "추억 만들기", value: "memory" },
  { label: "사랑 고백", value: "love" },
  { label: "축하하기", value: "celebrate" },
  { label: "사과하기", value: "apology" },
  { label: "감사하기", value: "thanks" },
];

export default function CategorySelectPage() {
  const router = useRouter();
  const { currentUser } = useAuth(); // 로그인 상태 확인

  const handleSelect = (value) => {
    // localStorage는 브라우저에서만 접근 가능하므로 안전하게 실행
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-category", value);
    }

    router.push("/LoveFormPage");
  };

  return (
    <div className={styles["category-page"]}>
      <h2 className={styles["category-title"]}>어떤 마음을 전하고 싶나요?</h2>
      <div className={styles["category-buttons"]}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={styles["category-button"]}
            onClick={() => handleSelect(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
