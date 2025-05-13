import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");

  // ✅ 메시지 불러오기
  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  // ✅ 이미지 불러오기
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("selected-images"));
    if (Array.isArray(storedImages)) {
      setSelectedImages(storedImages);
    }
  }, []);

  // ✅ 이미지 4장 순차 전환 (5초 간격, 총 20초)
  useEffect(() => {
    if (!Array.isArray(selectedImages) || selectedImages.length === 0) return;
    let index = 0;
    setCurrentImageIndex(index);
    const displayNext = () => {
      index++;
      if (index < selectedImages.length) {
        setCurrentImageIndex(index);
        setTimeout(displayNext, 5000);
      }
    };
    const timer = setTimeout(displayNext, 5000);
    return () => clearTimeout(timer);
  }, [selectedImages]);

  return (
    <div className="preview-page">
      <div className="media-box">
        {/* ✅ 감성 자막 */}
        <div className="scrolling-message-box">
          <div className="scrolling-message">{message}</div>
        </div>

        {/* ✅ 이미지 배경 (4장 순차 전환) */}
        {Array.isArray(selectedImages) &&
        selectedImages.length > 0 &&
        selectedImages[currentImageIndex] ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="preview"
            className="media-display"
          />
        ) : (
          <div className="media-fallback">이미지가 없습니다 😢</div>
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
