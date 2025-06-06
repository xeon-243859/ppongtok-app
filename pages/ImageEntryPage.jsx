// ImageEntryPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ImageEntryPage.module.css";

const ImageEntryPage = () => {
  const navigate = useNavigate();

  const handleSlotClick = (slot) => {
    navigate("/image/select", { state: { slot } });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 향후 사용자 파일 처리 로직 추가 가능
      alert("사용자 파일: " + file.name);
    }
  };

  return (
    <div className={styles["image-entry-container"]}>
    <h2 className={styles["image-entry-title"]}>이미지파일</h2>
    <label htmlFor="file-upload" className={styles["upload-button"]}>내파일선택</label>
    <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} />

    <div className={styles["image-slot"]} onClick={() => handleSlotClick("img-01")}>Img-01</div>
    ...
    <div className={styles["image-entry-buttons"]}>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <button onClick={() => navigate("/image/select")}>다음으로</button>

      </div>
    </div>
  );
};

export default ImageEntryPage;
