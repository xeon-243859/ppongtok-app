import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PreviewPage.css";

function PreviewPage() {
  const location = useLocation();
  const { selectedImages, selectedVideo, mediaType } = location.state || {};

  const [captionText, setCaptionText] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/share", {
      state: {
        selectedImages,
        selectedVideo,
        mediaType,
        captionText,
      },
    });
  };

  return (
    <div className="preview-wrapper">
      <div className="preview-page">
        <div className="media-box">
          <div className="moving-box">
            {mediaType === "video" && selectedVideo ? (
              <video
                src={selectedVideo}
                autoPlay
                muted
                playsInline
                className="media-display"
                onLoadedMetadata={(e) => {
                  e.target.currentTime = 0;
                  setTimeout(() => e.target.pause(), 30000);
                }}
              />
            ) : (
              selectedImages && selectedImages.length > 0 && (
                <img
                  src={selectedImages[0]}
                  alt="preview"
                  className="media-display"
                />
              )
            )}
            <div className="scrolling-caption">
              <span>{captionText}</span>
            </div>
          </div>
        </div>
        <input
          type="text"
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
          placeholder="전하고 싶은 말을 입력하세요 💌"
          className="caption-input"
        />
        <button onClick={handleNext} className="share-button">
          다음 - 공유하기
        </button>
      </div>
    </div>
  );
}

export default PreviewPage;
