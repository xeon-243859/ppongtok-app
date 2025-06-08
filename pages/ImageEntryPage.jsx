import React from "react";
import { useRouter } from "next/router";
import styles from "./ImageEntryPage.module.css";

export default function ImageEntryPage() {
  const router = useRouter();

  const handleSlotClick = (slot) => {
    router.push({
      pathname: "/image/select",
      query: { slot }
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert("사용자 파일: " + file.name);
    }
  };

  return (
    <div className={styles["image-entry-container"]}>
      <h2 className={styles["image-entry-title"]}>이미지파일</h2>

      <label htmlFor="file-upload" className={styles["upload-button"]}>내파일선택</label>
      <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} />

      <div className={styles["image-slot"]} onClick={() => handleSlotClick("img-01")}>
        Img-01
      </div>
      {/* 필요 시 다른 슬롯도 추가 */}

      <div className={styles["image-entry-buttons"]}>
        <button onClick={() => router.back()}>뒤로가기</button>
        <button onClick={() => router.push("/image/select")}>다음으로</button>
      </div>
    </div>
  );
}
