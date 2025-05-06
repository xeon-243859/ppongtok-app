// src/pages/LovePreviewPage.jsx

import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import "../styles/LovePreviewPage.css";

const LovePreviewPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [backgroundType, setBackgroundType] = useState("");
  const [background, setBackground] = useState("");
  const [music, setMusic] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("loveMessage") || "";
    const type = localStorage.getItem("backgroundType");
    const bg = type === "video"
      ? localStorage.getItem("selectedVideo")
      : localStorage.getItem("selectedImage");
    const mus = localStorage.getItem("selectedMusic");

    setMessage(msg);
    setBackgroundType(type);
    setBackground(bg);
    setMusic(mus);
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다!");
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("preview-area");
    html2pdf().from(element).save("ppongtok-love.pdf");
  };

  const handleReset = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="preview-wrapper">
      <div id="preview-area" className="preview-content">
        {backgroundType === "video" ? (
          <video
            src={`/videos/${background}`}
            autoPlay
            loop
            muted
            className="preview-video"
          />
        ) : (
          <img
            src={`/backgrounds/${background}`}
            alt="preview background"
            className="preview-image"
          />
        )}
        <div className="preview-message">
          {message.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>

      <audio src={`/audio/${music}`} autoPlay loop />

      <div className="preview-buttons">
        <button onClick={handleCopyLink}>🔗 링크 복사</button>
        <button onClick={handleDownloadPDF}>📄 PDF 저장</button>
        <button onClick={handleReset}>↩ 다시 만들기</button>
      </div>
    </div>
  );
};

export default LovePreviewPage;
