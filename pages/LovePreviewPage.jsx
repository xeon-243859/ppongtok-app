import React, { useEffect } from "react";
import styles from "./LovePreviewPage.module.css";

export default function LovePreviewPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const video = localStorage.getItem("video-0");
  const image = localStorage.getItem("image-0");
  const music = localStorage.getItem("music-0");
  const message = localStorage.getItem("love-text") || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  const handleDownload = () => {
    alert("PDF 저장 기능은 곧 추가됩니다!");
  };

  const handleRestart = () => {
    window.location.href = "/";
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(message || "사랑 고백 메시지를 확인해보세요!");

    let shareUrl = "";
    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === "kakao") {
      alert("카카오톡 공유는 추후 지원됩니다.");
      return;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <div className={styles["preview-container"]}>
      {image && image.includes("data:image") ? (
        <img className={styles["preview-media"]} src={image} alt="선택된 이미지" />
      ) : video && video.includes(".mp4") ? (
        <video className={styles["preview-media"]} src={video} autoPlay loop muted />
      ) : (
        <div className={styles["preview-placeholder"]}>배경이 없습니다.</div>
      )}

      {message && (
        <div className={styles["preview-caption"]}>
          {message}
        </div>
      )}

      {music && <audio src={music} autoPlay loop className={styles["preview-audio"]} />}

      <div className={styles["preview-buttons"]}>
        <button onClick={handleCopy}>링크 복사</button>
        <button onClick={handleDownload}>PDF 저장</button>
        <button onClick={handleRestart}>처음으로</button>
      </div>

      <div className={styles["preview-buttons"]}>
        <button onClick={() => handleShare("facebook")}>Facebook</button>
        <button onClick={() => handleShare("twitter")}>Twitter</button>
        <button onClick={() => handleShare("kakao")}>KakaoTalk</button>
      </div>
    </div>
  );
}
