import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./LovePreviewPage.css";

export default function LovePreviewPage() {
  const location = useLocation();
  const { backgroundImage, backgroundVideo, backgroundMusic, loveMessage } = location.state || {};
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // 텍스트 애니메이션처럼 등장
    const timer = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="preview-container">
      {/* 배경 출력 */}
      {backgroundVideo ? (
        <video className="background-media" src={backgroundVideo} autoPlay loop muted />
      ) : backgroundImage ? (
        <img className="background-media" src={backgroundImage} alt="배경 이미지" />
      ) : (
        <div className="background-placeholder">배경이 선택되지 않았습니다</div>
      )}

      {/* 음악 재생 */}
      {backgroundMusic && <audio src={backgroundMusic} autoPlay loop />}

      {/* 자막 또는 고백 메시지 출력 */}
      {showMessage && loveMessage && (
        <div className="love-message">
          {loveMessage}
        </div>
      )}
    </div>
  );
}


