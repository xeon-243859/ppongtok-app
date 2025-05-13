import React, { useEffect, useState, useRef } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaType, setMediaType] = useState("none");

  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const audioRef = useRef(null);

  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("selected-images") || "[]");
    const hasValidVideo = selectedVideo && selectedVideo !== "null" && selectedVideo !== "";

    if (hasValidVideo) {
      setMediaType("video");
    } else if (Array.isArray(storedImages) && storedImages.length > 0) {
      setSelectedImages(storedImages);
      setMediaType("image");
    } else {
      setMediaType("none");
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (mediaType !== "image") return;
    if (!Array.isArray(selectedImages) || selectedImages.length === 0) return;
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
  }, [mediaType, selectedImages]);

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
        {mediaType === "video" ? (
          <div className="video-container">
            <video
              src={selectedVideo}
              autoPlay
              muted
              className="media-display"
              onLoadedMetadata={(e) => {
                e.target.currentTime = 0;
                setTimeout(() => {
                  e.target.pause();
                }, 30000);
              }}
            />
          </div>
        ) : mediaType === "image" ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="preview"
            className="media-display"
          />
        ) : (
          <div className="media-fallback">배경이 없습니다</div>
        )}

        <div className="scrolling-message-box">
          <div className="scrolling-message">{message}</div>
        </div>

        <div className="button-box">
          <button className="styled-button" onClick={() => window.history.back()}>
            ← 뒤로가기
          </button>
          <button
            className="styled-button"
            onClick={() => (window.location.href = "/share")}
          >
            다음 - 공유하기 →
          </button>
        </div>
      </div>

      {selectedMusic && <audio src={selectedMusic} autoPlay ref={audioRef} />}
    </div>
  );
};

export default PreviewPage;
