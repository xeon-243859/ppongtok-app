import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  let selectedImages;
  try {
    selectedImages = JSON.parse(localStorage.getItem("selected-images")) || [];
  } catch (e) {
    selectedImages = [];
  }

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
  
  useEffect(() => {
  if (!Array.isArray(selectedImages) || selectedImages.length === 0) return;
  let index = 0;
  setCurrentImageIndex(index);
  const interval = setInterval(() => {
    index++;
    if (index >= selectedImages.length) {
      clearInterval(interval);
    } else {
      setCurrentImageIndex(index);
    }
  }, 5000);
  return () => clearInterval(interval);
}, [selectedImages]);

  // ✅ 이미지 4장 전환 (5초 간격, 20초 정지)
  useEffect(() => {
    if (!Array.isArray(selectedImages) || selectedImages.length === 0) return;
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= selectedImages.length) {
        clearInterval(interval);
      } else {
        setCurrentImageIndex(index);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedImages]);

  // ✅ 디버깅 로그
  useEffect(() => {
    console.log("📝 메시지:", message);
    console.log("🖼 이미지 배열:", selectedImages);
    console.log("🎥 영상:", selectedVideo);
    console.log("🎵 음악:", selectedMusic);
  }, []);

  return (
    <div className="preview-page">
      <div className="media-box">
        <div className="message-text">{displayedText}</div>

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
) : (
  Array.isArray(selectedImages) &&
  selectedImages.length > 0 &&
  selectedImages[currentImageIndex] ? (
    <img
      src={selectedImages[currentImageIndex]}
      alt="preview"
      className="media-display"
    />
  ) : (
    <div className="media-fallback">이미지가 없습니다 😢</div>
  )
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
