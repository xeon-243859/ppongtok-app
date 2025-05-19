import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./PreviewPage.css";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const forcedMediaType = params.get("type");

  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaType, setMediaType] = useState("none");

  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const audioRef = useRef(null);
  const handleGoHome = () => {
  navigate("/");
};
  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  useEffect(() => {
    const rawImages = JSON.parse(localStorage.getItem("selected-images") || "[]");
    const validImages = Array.isArray(rawImages)
      ? rawImages.filter((img) => typeof img === "string" && img.trim() !== "")
      : [];
    setSelectedImages(validImages);

    const hasImages = validImages.length > 0;
    const hasVideo = selectedVideo && selectedVideo !== "null" && selectedVideo !== "";

    if (forcedMediaType === "image" && hasImages) {
      setMediaType("image");
    } else if (forcedMediaType === "video" && hasVideo) {
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
    if (mediaType !== "image" || selectedImages.length === 0) return;

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

  const repeatedMessage = message.length < 20 ? message.repeat(3) : message;

  return (
    <div className="preview-wrapper">
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
                autoPlay
                muted
                playsInline
                className="media-display"
                onLoadedMetadata={(e) => {
                  e.target.currentTime = 0;
                  setTimeout(() => {
                    e.target.pause();
                  }, 30000);
                }}
              />
            ) : (
              <div className="media-fallback">배경이 없습니다</div>
            )}

            <div className="scrolling-caption">
              <span>{repeatedMessage}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-container">
        <div className="preview-content">
          {/* 필요한 경우 추가 콘텐츠 삽입 */}
        </div>

        <div className="preview-buttons">
        <button className="styled-button" onClick={() => (window.location.href = "/music")}>
               뒤로가기
          </button>
  
          <button className="styled-button" onClick={() => (window.location.href = "/share")}>
            다음 - 공유하기
          </button>
        <div className="go-home-button-wrapper">
        <button className="go-home-button" onClick={handleGoHome}>
          처음으로
         </button>
        </div>

        </div>

        {selectedMusic && (
          <audio src={selectedMusic} autoPlay ref={audioRef} />
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
