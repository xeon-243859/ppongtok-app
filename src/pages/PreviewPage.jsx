import React from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  // ⚠️ 상태 사용하지 않고 직접 localStorage 접근
  const message = localStorage.getItem("message");
  const image = localStorage.getItem("selected-image");
  const video = localStorage.getItem("selected-video");
  const music = localStorage.getItem("selected-music");

  return (
    <div className="preview-page">
      {/* 🎬 배경: 이미지 또는 영상 */}
      {image && !video && (
        <img src={image} alt="선택된 이미지" className="preview-background" />
      )}
      {video && !image && (
        <video key={video} className="preview-background" autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
      )}

      {/* 📝 메시지 */}
      {message ? (
        <div className="preview-subtitle">{message}</div>
      ) : (
        <div className="preview-subtitle">메시지가 없습니다.</div>
      )}

      {/* 🎵 음악 */}
      {music && (
        <audio key={music} autoPlay loop>
          <source src={music} type="audio/mp3" />
        </audio>
      )}
    </div>
  );
};

export default PreviewPage;
