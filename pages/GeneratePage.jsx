import React from 'react';
import styles from "./GeneratePage.module.css";

export default function GeneratePage({ message, selectedImage, selectedVideo, selectedMusic }) {
  return (
    <div className={styles["generate-container"]}>
      <h2>완성된 사랑 메시지를 확인해 보세요!</h2>

      {selectedMusic && (
        <audio src={selectedMusic} autoPlay loop controls className={styles["audio-player"]} />
      )}

      {selectedVideo ? (
        <video
          src={selectedVideo}
          autoPlay
          loop
          muted
          controls
          className={styles["media-preview"]}
        />
      ) : selectedImage ? (
        <img
          src={selectedImage}
          alt="선택된 이미지"
          className={styles["media-preview"]}
        />
      ) : null}

      <div className={styles["message-box"]}>
        <p>{message}</p>
      </div>

      <div className={styles["share-buttons"]}>
        <button>📄 PDF 저장</button>
        <button>🔗 링크 복사</button>
        <button>📷 이미지 저장</button>
        <button>📢 페이스북 공유</button>
      </div>
    </div>
  );
}
