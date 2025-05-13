import React, { useEffect, useState, useRef } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const audioRef = useRef(null);

  // ✅ 정확한 영상 선택 여부 판단
  const isVideoSelected =
    selectedVideo &&
    selectedVideo !== "null" &&
    selectedVideo !== null &&
    selectedVideo !== "";

  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("selected-images"));
    if (Array.isArray(storedImages)) {
      setSelectedImages(storedImages);
    }
  }, []);

  // 자막 타자 효과 유지
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
    }, 45000 / message.length); // 예: 45초 기준
    return () => clearInterval(interval);
  }, [message]);

  // 이미지 순차 전환 (30초 후 정지)
  useEffect(() => {
    if (!Array.isArray(selectedImages) || selectedImages.length === 0 || isVideoSelected) return;
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
  }, [selectedImages, isVideoSelected]);

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
        {/* 자막 */}
        <div className="message-text">{displayedText}</div>

        {/* ✅ 영상과 이미지 완전 분리 */}
        {isVideoSelected ? (
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
        ) : selectedImages.length > 0 ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="preview"
            className="media-display"
          />
        ) : (
          <div className="media-fallback">배경이 없습니다</div>
        )}
      </div>

      <div className="button-box">
        <button className="styled-button" onClick={() => window.history.back()}>← 뒤로가기</button>
        <button className="styled-button" onClick={() => window.location.href = "/share"}>다음 - 공유하기 →</button>
      </div>

      {selectedMusic && <audio src={selectedMusic} autoPlay ref={audioRef} />}
    </div>
  );
};

export default PreviewPage;
