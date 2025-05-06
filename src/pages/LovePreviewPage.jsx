import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./LovePreviewPage.css";

const LovePreviewPage = () => {
  const location = useLocation();
  const { backgroundType, selected, music } = location.state || {};
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="preview-container">
      {backgroundType === "video" ? (
        <video src={`/videos/${selected}`} autoPlay loop muted className="background-media" />
      ) : (
        <img src={selected} alt="배경 이미지" className="background-media" />
      )}

      {music && <audio src={`/audio/${music}`} autoPlay loop />}

      {showText && (
        <div className="love-message">
          당신에게 꼭 전하고 싶은 말이 있어요
        </div>
      )}
    </div>
  );
};

export default LovePreviewPage;
