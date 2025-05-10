// ✅ LovePreviewPage.jsx
import React, { useEffect } from "react";
import "./LovePreviewPage.css";

const LovePreviewPage = () => {
  const video = localStorage.getItem("video-0");
  const music = localStorage.getItem("music-0");
  const message = localStorage.getItem("love-text");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="preview-container">
      {/* 배경 */}
      {video ? (
        <video className="preview-media" src={video} autoPlay loop muted />
      ) : (
        <div className="preview-placeholder">영상이 없습니다.</div>
      )}

      {/* 자막 */}
      {message && <div className="preview-caption">{message}</div>}

      {/* 음악 */}
      {music && <audio src={music} autoPlay loop className="preview-audio" />}
    </div>
  );
};

export default LovePreviewPage;
