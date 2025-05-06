// PreviewPage.jsx (전체코드)
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PreviewPage.css";

const PreviewPage = () => {
  const location = useLocation();
  const { selectedImages, selectedVideo, selectedMusic, message } = location.state || {};
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= message.length) {
        setTypedMessage(message.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="preview-container">
      {/* 배경 */}
      {selectedVideo ? (
        <video className="background-video" src={selectedVideo} autoPlay loop muted />
      ) : (
        <img
          className="background-image"
          src={selectedImages && selectedImages[0] ? selectedImages[0] : ""}
          alt="배경"
        />
      )}

      {/* 음악 */}
      {selectedMusic && (
        <audio src={selectedMusic} autoPlay loop />
      )}

      {/* 자막 메시지 */}
      <div className="message-text">{typedMessage}</div>

      {/* 공유 버튼 */}
      <div className="button-group">
        <button className="share-button">링크 복사</button>
        <button className="share-button">PDF 저장</button>
        <button className="share-button">SNS 공유</button>
      </div>
    </div>
  );
};

export default PreviewPage;
