import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [music, setMusic] = useState("");

  useEffect(() => {
    // 확실하게 각 항목 불러오기
    const msg = localStorage.getItem("message");
    const img = localStorage.getItem("selected-image");
    const vid = localStorage.getItem("selected-video");
    const mus = localStorage.getItem("selected-music");

    console.log("📝 메시지:", msg);
    console.log("🖼️ 이미지:", img);
    console.log("🎬 영상:", vid);
    console.log("🎵 음악:", mus);

    setMessage(msg || "");
    setImage(img || "");
    setVideo(vid || "");
    setMusic(mus || "");
  }, []);

  const renderBackground = () => {
    if (image && !video) {
      return <img src={image} alt="배경 이미지" className="preview-background" />;
    } else if (video && !image) {
      return (
        <video className="preview-background" autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
      );
    } else {
      return <div className="preview-background" style={{ backgroundColor: "#000" }} />;
    }
  };

  return (
    <div className="preview-page">
      {/* 🎨 배경: 이미지 또는 영상 */}
      {renderBackground()}

      {/* ✨ 메시지 */}
      {message && <div className="preview-subtitle">{message}</div>}

      {/* 🎵 음악 */}
      {music && (
        <audio autoPlay loop>
          <source src={music} type="audio/mp3" />
        </audio>
      )}

      {/* 🔗 공유 */}
      <div className="preview-buttons">
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
          링크 복사
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
