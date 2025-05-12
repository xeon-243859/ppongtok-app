import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const selectedImage = localStorage.getItem("selected-image");
  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const message = localStorage.getItem("message");

  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!message) return;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + message[index]);
      index++;
      if (index >= message.length) clearInterval(interval);
    }, 20000 / message.length);

    return () => clearInterval(interval);
  }, [message]);
 
  useEffect(() => {
  console.log("📝 메시지:", localStorage.getItem("message"));
  console.log("🖼 이미지:", localStorage.getItem("selected-image"));
  console.log("🎥 영상:", localStorage.getItem("selected-video"));
  console.log("🎵 음악:", localStorage.getItem("selected-music"));
}, []);

  return (
    <div className="preview-page">
      {/* 감성 틀 박스 */}
      <div className="media-box">
        {/* 메시지 */}
        <div className="message-text">{displayedText}</div>

        {/* 이미지 or 영상 */}
        {selectedImage && (
          <img
            src={`/backgrounds/${selectedImage}`}
            alt="preview"
            className="media-display"
          />
        )}
        {selectedVideo && (
          <video
            src={`/videos/${selectedVideo}`}
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
        )}
      </div>

      {/* 공유 & 뒤로 버튼 */}
      <div className="button-box">
        <button onClick={() => window.history.back()}>뒤로가기</button>
        <button onClick={() => window.location.href = "/share"}>다음 - 공유하기</button>
      </div>

      {/* 음악 자동 재생 */}
      {selectedMusic && <audio src={`/audio/${selectedMusic}`} autoPlay />}
    </div>
  );
};

export default PreviewPage;
