import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./PreviewPage.css";

const PreviewPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const forcedMediaType = params.get("type");

  const [message, setMessage] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaType, setMediaType] = useState("none");

  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const imageIntervalRef = useRef(null);

  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  useEffect(() => {
    if (!message) return;
    let index = 0;
    setTypedMessage("");
    const typingSpeed = Math.max(30, 30000 / message.length);
    const interval = setInterval(() => {
      setTypedMessage((prev) => prev + message.charAt(index));
      index++;
      if (index >= message.length) clearInterval(interval);
    }, typingSpeed);
    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    const rawImages = JSON.parse(localStorage.getItem("selected-images") || "[]");
    const validImages = Array.isArray(rawImages)
      ? rawImages.filter((img) => typeof img === "string" && img.trim() !== "")
      : [];

    setSelectedImages(validImages);

    const hasImages = validImages.length > 0;
    const hasVideo = selectedVideo && selectedVideo !== "null" && selectedVideo !== "";

    if (forcedMediaType === "image") {
      setMediaType("image");
    } else if (forcedMediaType === "video") {
      setMediaType("video");
    } else if (hasImages) {
      setMediaType("image");
    } else if (hasVideo) {
      setMediaType("video");
    } else {
      setMediaType("none");
    }
  }, [forcedMediaType]);

  useEffect(() => {
    // 이미지가 2장 이상일 때 5초마다 전환
    if (mediaType === "image" && selectedImages.length > 1) {
      let index = 0;
      setCurrentImageIndex(index);
      imageIntervalRef.current = setInterval(() => {
        index = (index + 1) % selectedImages.length;
        setCurrentImageIndex(index);
      }, 5000); // ✅ 5초 간격 전환
    }

    // 30초 후 이미지/음악/영상 모두 정지
    const timeout = setTimeout(() => {
      if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
    }, 30000); // ✅ 30초 후 정지

    return () => {
      clearTimeout(timeout);
      if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
    };
  }, [mediaType, selectedImages]);

  return (
    <div className="preview-page">
      <div className="media-box">
        <div className="moving-box">
          {mediaType === "image" && selectedImages.length > 0 ? (
            <img
              src={selectedImages[currentImageIndex % selectedImages.length]}
              alt="preview"
              className="media-display"
            />
          ) : mediaType === "video" ? (
            <video
              src={selectedVideo}
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="media-display"
              onLoadedMetadata={(e) => {
                e.target.currentTime = 0;
              }}
            />
          ) : (
            <div className="media-fallback">배경이 없습니다</div>
          )}

          <div className="scrolling-message-bottom">{typedMessage}</div>
        </div>
      </div>

      <div className="button-box">
        <button className="styled-button" onClick={() => window.history.back()}>
          뒤로가기
        </button>
        <button className="styled-button" onClick={() => (window.location.href = "/share")}>
          다음 - 공유하기
        </button>
      </div>

      {selectedMusic && <audio src={selectedMusic} autoPlay ref={audioRef} />}
    </div>
  );
};

export default PreviewPage;

