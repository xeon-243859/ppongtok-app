// ✅ EPreviewPage.jsx - 이미지 배경 전용 미리보기
import React, { useEffect } from "react";
import "./LovePreviewPage.css";

const EPreviewPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="preview-container">
      {image && image.includes("data:image") ? (
        <img className="preview-media" src={image} alt="선택된 이미지" />
      ) : (
        <div className="preview-placeholder">배경 이미지가 없습니다.</div>
      )}

      {message && <div className="preview-caption">{message}</div>}

      {music && <audio src={music} autoPlay loop className="preview-audio" />}

      <div className="preview-buttons">
        <button onClick={handleCopy}>링크 복사</button>
        <button onClick={handleDownload}>PDF 저장</button>
        <button onClick={handleRestart}>처음으로</button>
      </div>

      <div className="preview-buttons">
        <button onClick={() => handleShare("facebook")}>Facebook</button>
        <button onClick={() => handleShare("twitter")}>Twitter</button>
        <button onClick={() => handleShare("kakao")}>KakaoTalk</button>
      </div>
    </div>
  );
};

export default EPreviewPage;
