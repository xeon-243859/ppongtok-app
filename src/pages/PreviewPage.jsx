import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

function PreviewPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(""); // ✅ 음악 상태 추가
  const [message, setMessage] = useState("");

  useEffect(() => {
    const img = localStorage.getItem("selected-image");
    const vid = localStorage.getItem("selected-video");
    const music = localStorage.getItem("selected-music"); // ✅ 음악 가져오기
    const msg = localStorage.getItem("message");

    setSelectedImage(img || "");
    setSelectedVideo(vid || "");
    setSelectedMusic(music || ""); // ✅ 음악 저장
    setMessage(msg || "");

    // ✅ 콘솔 확인용
    console.log("영상:", vid);
    console.log("음악:", music);
  }, []);

  return (
    <div className="preview-page">
      {/* 이미지 or 영상 배경 */}
      {selectedImage && !selectedVideo && (
        <img
          src={selectedImage}
          alt="배경 이미지"
          className="preview-background"
        />
      )}
      {selectedVideo && !selectedImage && (
        <video
          className="preview-background"
          autoPlay
          loop
          muted
        >
          <source src={selectedVideo} type="video/mp4" />
        </video>
      )}

      {/* 자막 메시지 */}
      <div className="preview-subtitle">
        {message}
      </div>

      {/* 🔊 배경 음악 재생 */}
      {selectedMusic && (
        <audio autoPlay loop>
          <source src={selectedMusic} type="audio/mp3" />
        </audio>
      )}

      {/* 링크 복사 버튼 */}
      <div className="preview-buttons">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          링크 복사하기
        </button>
      </div>
    </div>
  );
}

export default PreviewPage;
