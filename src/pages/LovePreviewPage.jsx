// ✅ LovePreviewPage.jsx
import React, { useEffect } from "react";
import "./LovePreviewPage.css";

const LovePreviewPage = () => {
  const video = localStorage.getItem("video-0");
  const image = localStorage.getItem("image-0");
  const music = localStorage.getItem("music-0");
  const message = localStorage.getItem("love-text");

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("🎬 배경 영상 (video-0):", video);
    console.log("🖼️ 배경 이미지 (image-0):", image);
    console.log("🎵 배경 음악 (music-0):", music);
    console.log("💌 자막 텍스트 (love-text):", message);
  }, []);

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
    <div className="preview-container">
      {video && !image ? (
        <video className="preview-media" src={video} autoPlay loop muted />
      ) : image ? (
        <img className="preview-media" src={image} alt="선택된 이미지" />
      ) : (
        <div className="preview-placeholder">배경이 없습니다.</div>
      )}

      {message && <div className="preview-caption">{message}</div>}

      {music && <audio src={music} autoPlay loop className="preview-audio" />}

      <div className="preview-buttons">
        <button onClick={handleCopy}>링크 복사</button>
        <button onClick={handleDownload}>PDF 저장</button>
        <button onClick={handleRestart}>처음으로</button>
      </div>

      <div className="preview-sns">
        <button onClick={() => handleShare("facebook")}>📘</button>
        <button onClick={() => handleShare("twitter")}>🐦</button>
        <button onClick={() => handleShare("kakao")}>💬</button>
      </div>
    </div>
  );
};

export default LovePreviewPage;
