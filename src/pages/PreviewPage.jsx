import React, { useEffect, useState, useRef } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const audioRef = useRef(null);

  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");

  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("selected-images"));
    if (Array.isArray(storedImages) && storedImages.length > 0) {
      setSelectedImages(storedImages);
      setShowImage(true);
    }
    if (selectedVideo && selectedVideo !== "null") {
      setShowVideo(true);
      setShowImage(false);
    }
  }, [selectedVideo]);

  // 이미지 5초 간격 순환 → 30초 후 정지
  useEffect(() => {
    if (!showImage || selectedImages.length === 0) return;
    let index = 0;
    setCurrentImageIndex(index);
    const interval = setInterval(() => {
      index = (index + 1) % selectedImages.length;
      setCurrentImageIndex(index);
    }, 5000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 30000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showImage, selectedImages]);

  // 영상 30초 후 정지
  useEffect(() => {
    if (!showVideo) return;
    const timer = setTimeout(() => {
      const video = document.querySelector("video");
      if (video) video.pause();
    }, 30000);
    return () => clearTimeout(timer);
  }, [showVideo]);

  // 음악 30초 후 정지
  useEffect(() => {
    if (!audioRef.current) return;
    const timer = setTimeout(() => {
      audioRef.current.pause();
    }, 30000);
    return () => clearTimeout(timer);
  }, [selectedMusic]);

  return (
    <div className="preview-page">
      <div className="media-box">
        <div className="scrolling-message-box">
          <div className="scrolling-message">{message}</div>
        </div>

        {showVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            muted
            className="media-display"
          />
        ) : showImage && selectedImages.length > 0 ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="preview"
            className="media-display"
          />
        ) : (
          <div className="media-fallback">배경 미디어가 없습니다 😢</div>
        )}
      </div>

      <div className="button-box">
        <button className="btn-back" onClick={() => window.history.back()}>
          ← 뒤로가기
        </button>
        <button className="btn-next" onClick={() => (window.location.href = "/share")}>
          다음 - 공유하기 →
        </button>
      </div>

      {selectedMusic && (
        <audio ref={audioRef} src={selectedMusic} autoPlay />
      )}
    </div>
  );
};

export default PreviewPage;
