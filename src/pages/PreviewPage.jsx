import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const selectedImage = localStorage.getItem("selected-image");
  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const message = localStorage.getItem("message");

  const [displayedText, setDisplayedText] = useState("");

  // 타자 효과 구현
  useEffect(() => {
    if (!message) return;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + message[index]);
      index++;
      if (index >= message.length) clearInterval(interval);
    }, 20 * 1000 / message.length); // 전체 20초에 분배

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="preview-frame">
      {/* 메시지 */}
      <div className="message-area">{displayedText}</div>

      {/* 이미지 또는 영상 (둘 중 하나만) */}
      {selectedImage && (
        <img
          src={`/backgrounds/${selectedImage}`}
          alt="Selected Background"
          className="media-display"
        />
      )}
      {selectedVideo && (
        <video
          src={`/videos/${selectedVideo}`}
          className="media-display"
          autoPlay
          muted
          onLoadedMetadata={(e) => {
            e.target.currentTime = 0;
            setTimeout(() => {
              e.target.pause();
            }, 20000); // 20초 재생 후 정지
          }}
        />
      )}

      {/* 버튼 */}
      <div className="button-box">
        <button onClick={() => window.history.back()}>뒤로가기</button>
        <button onClick={() => window.location.href = "/share"}>다음 - 공유하기</button>
      </div>

      {/* 음악 */}
      {selectedMusic && (
        <audio src={`/audio/${selectedMusic}`} autoPlay />
      )}
    </div>
  );
};

export default PreviewPage;
