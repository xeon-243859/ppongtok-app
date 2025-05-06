// src/pages/LovePreviewPage.jsx
import React, { useEffect, useRef, useState } from "react";
import "./LoveFormPage.css";

function LovePreviewPage() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [background, setBackground] = useState(null);
  const [music, setMusic] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const bgImage = localStorage.getItem("selectedBackground");
    const bgVideo = localStorage.getItem("selectedVideo");
    const bgMusic = localStorage.getItem("selectedMusic");
    const msg = history.state?.usr?.message || localStorage.getItem("message") || "";

    if (bgImage) setBackground({ type: "image", src: bgImage });
    else if (bgVideo) setBackground({ type: "video", src: bgVideo });
    if (bgMusic) setMusic(bgMusic);
    setMessage(msg);
  }, []);

  return (
    <div className="preview-container">
      {background?.type === "image" && (
        <img src={background.src} alt="Preview" className="preview-media" />
      )}
      {background?.type === "video" && (
        <video
          ref={videoRef}
          src={background.src}
          className="preview-media"
          autoPlay
          muted
          loop
        />
      )}

      {music && <audio ref={audioRef} src={music} autoPlay loop />}

      <div className="preview-message">{message}</div>

      <div className="preview-buttons">
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
          링크 복사
        </button>
        <button onClick={() => window.print()}>PDF 저장</button>
        <button onClick={() => window.location.href = "/"}>처음으로</button>
      </div>
    </div>
  );
}

export default LovePreviewPage;
