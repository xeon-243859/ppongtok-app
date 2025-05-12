import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const selectedImages = JSON.parse(localStorage.getItem("selected-images")); // ✅ 이미지 배열
  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const message = localStorage.getItem("message");

  const [displayedText, setDisplayedText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ 메시지 타자 효과
  useEffect(() => {
    if (!message) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20000 / message.length);
    return () => clearInterval(interval);
  }, [message]);

  // ✅ 이미지 4장 순차 전환
  useEffect(() => {
    if (!selectedImages || selectedImages.length === 0) return;
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= selectedImages.length) {
        clearInterval(interval);
      } else {
        setCurrentImageIndex(index);
      }
    }, 5000); // 5초마다 전환
    return () => clearInterval(interval);
  }, [selectedImages]);

  return (
    <div className="preview-page">
      <div className="media-box">
        <div className="message-text">{displayedText}</div>

        {/* ✅ 영상이 있을 경우 우선 */}
        {selectedVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            muted
            className="media-display"
            onLoadedMetadata={(e) => {
              e.target.currentTime = 0;
              setTimeout(() => {
                e.target.pause();
              }, 20000);
            }}
          />
        ) : selectedImages && selectedImages.length > 0 ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="preview"
            className="media-display"
          />
        ) : null}
      </div>

      <div className="button-box">
        <button onClick={() => window.history.back()}>뒤로가기</button>
        <button onClick={() => window.location.href = "/share"}>다음 - 공유하기</button>
      </div>

      {selectedMusic && <audio src={selectedMusic} autoPlay />}
    </div>
  );
};

export default PreviewPage;
