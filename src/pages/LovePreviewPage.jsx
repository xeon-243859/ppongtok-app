// ✅ LovePreviewPage.jsx
import React, { useEffect, useState } from "react";
import "./LovePreviewPage.css";

const LovePreviewPage = () => {
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [music, setMusic] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadedVideo = localStorage.getItem("video-0");
    const loadedImage = localStorage.getItem("image-0");
    const loadedMusic = localStorage.getItem("music-0");
    const loadedMessage = localStorage.getItem("love-text");

    setVideo(loadedVideo);
    setImage(loadedImage);
    setMusic(loadedMusic);
    setMessage(loadedMessage);

    console.log("🎬 배경 영상 (video-0):", loadedVideo);
    console.log("🖼️ 배경 이미지 (image-0):", loadedImage);
    console.log("🎵 배경 음악 (music-0):", loadedMusic);
    console.log("💌 자막 텍스트 (love-text):", loadedMessage);
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

  const clearMusic = () => {
    localStorage.removeItem("music-0");
    setMusic(null);
  };

  const clearVideo = () => {
    localStorage.removeItem("video-0");
    setVideo(null);
  };

  return (
    <div className="preview-container">
      {image ? (
        <img className="preview-media" src={image} alt="선택된 이미지" />
      ) : video ? (
        <div className="video-wrapper">
          <video className="preview-media" src={video} autoPlay loop muted />
          <button className="preview-video-remove" onClick={clearVideo}>✖</button>
        </div>
      ) : (
        <div className="preview-placeholder">배경이 없습니다.</div>
      )}

      {message && <div className="preview-caption">{message}</div>}

      {music && (
        <>
          <audio src={music} autoPlay loop className="preview-audio" />
        </>
      )}

      <div className="preview-buttons">
        <button onClick={handleCopy}>링크 복사</button>
        <button onClick={handleDownload}>PDF 저장</button>
        <button onClick={handleRestart}>처음으로</button>
      </div>

      <div className="preview-buttons">
        <button onClick={() => handleShare("facebook")}>Facebook</button>
        <button onClick={() => handleShare("twitter")}>Twitter</button>
        <button onClick={() => handleShare("kakao")}>KakaoTalk</button>
        {music && <button onClick={clearMusic}>🎵 음악 제거</button>}
      </div>
    </div>
  );
};

export default LovePreviewPage;
