// PreviewPage.jsx (최신 수정본)
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PreviewPage.css";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedImages, selectedVideo, selectedMusic, message } = location.state || {};
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= message?.length) {
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
      {selectedVideo ? (
        <video
          className="preview-video"
          src={selectedVideo}
          autoPlay
          loop
          muted
        />
      ) : (
        <img
          className="preview-image"
          src={selectedImages && selectedImages[0] ? selectedImages[0] : ""}
          alt="배경"
        />
      )}

      {selectedMusic && <audio src={selectedMusic} autoPlay loop />}

      <div className="preview-caption">{typedMessage}</div>

      <div className="preview-buttons">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    </div>
  );
};

export default PreviewPage;
