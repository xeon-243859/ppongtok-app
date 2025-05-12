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

  // 🔎 콘솔 로그 확인 (유지)
  useEffect(() => {
    console.log("📝 메시지:", message);
    console.log("🖼 이미지:", selectedImage);
    console.log("🎥 영상:", selectedVideo);
    console.log("🎵 음악:", selectedMusic);
  }, []);

  return (
    <div className="preview-page">
      <div className="media-box">
        <div className="message-text">{displayedText}</div>

        {selectedImage && (
          <img
            src={selectedImage} // ✅ 중복 제거
            alt="preview"
            className="media-display"
          />
        )}

        {selectedVideo && (
          <video
            src={selectedVideo} // ✅ 중복 제거
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

      <div className="button-box">
        <button onClick={() => window.history.back()}>뒤로가기</button>
        <button onClick={() => window.location.href = "/share"}>다음 - 공유하기</button>
      </div>

      {selectedMusic && <audio src={selectedMusic} autoPlay />}
    </div>
  );
};

export default PreviewPage;
