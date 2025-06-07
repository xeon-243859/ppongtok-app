import React from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter
import styles from "@/styles/StyleSelectPage.module.css"; // ✅ module.css 방식으로 통일

export default function TestAudioPage() {
  const router = useRouter();

  return (
    <div className={styles.selectCenterBox}>
      <h2 className={styles.centerTitle}>어떤 배경으로 사랑을 담아볼까요?</h2>

      <div className={styles.centerButtons}>
        <button className={styles.centerBtn} onClick={() => router.push("/image/select")}>
          이미지 배경 선택
        </button>
        <button className={styles.centerBtn} onClick={() => router.push("/video/select")}>
          영상 배경 선택
        </button>
      </div>
    </div>
  );
}
