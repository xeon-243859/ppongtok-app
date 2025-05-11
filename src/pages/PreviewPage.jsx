import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

function PreviewPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedMusic, setSelectedMusic] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const img = localStorage.getItem("selected-image");
    const vid = localStorage.getItem("selected-video");
    const music = localStorage.getItem("selected-music");
    const msg = localStorage.getItem("message");

    setSelectedImage(img || "");
    setSelectedVideo(vid || "");
    setSelectedMusic(music || "");
    setMessage(msg || "");

    console.log("🎬 선택된 영상:", vid);
    console.log("🖼️ 선택된 이미지:", img);
    console.log("🎵 선택된 음악:", music);
    console.log("📝 입력된 메시지:", msg);
  }, []);

  return (
    <div className="preview-page">
      {/* 배경: 이미지 or 영상 중 하나만 출력 */}
      {selectedImage && !selectedVideo && (
        <img src={selectedImage} alt="배경 이미지" className="preview-background" />
      )}
      {selectedVideo && !selectedImage && (
        <video className="preview-background" autoPlay loop muted>
          <source src={selectedVideo} type="video/mp4" />
          영상 로딩 중...
        </video>
      )}

      {/* 자막 메시지 */}
      <div className="preview-subtitle">{message}</div>

      {/* 배경 음악 */}
      {selectedMusic && (
        <audio autoPlay loop>
          <source src={selectedMusic} type="audio/mp3" />
        </audio>
      )}

      {/* 링크 복사 버튼 */}
      <div className="preview-buttons">
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
          링크 복사하기
        </button>
      </div>
    </div>
  );
}

export default PreviewPage;
