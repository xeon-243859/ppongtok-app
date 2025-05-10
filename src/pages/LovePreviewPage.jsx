// ✅ LovePreviewPage.jsx
import React, { useEffect } from "react";
import "./LovePreviewPage.css";

const LovePreviewPage = () => {
  const video = localStorage.getItem("video-0");
  const music = localStorage.getItem("music-0");
  const message = localStorage.getItem("love-text");

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("🎬 배경 영상 (video-0):", video);
    console.log("🎵 배경 음악 (music-0):", music);
    console.log("💌 자막 텍스트 (love-text):", message);
  }, []);

  return (
    <div className="preview-container">
      {video ? (
        <video className="preview-media" src={video} autoPlay loop muted />
      ) : (
        <div className="preview-placeholder">영상이 없습니다.</div>
      )}

      {message && <div className="preview-caption">{message}</div>}

      {music && <audio src={music} autoPlay loop className="preview-audio" />}
    </div>
  );
};

export default LovePreviewPage;
