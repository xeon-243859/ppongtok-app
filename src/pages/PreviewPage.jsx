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

  // ✅ 메시지 자막 흐름 (45초 속도, 누적 없이 출력)
  useEffect(() => {
    if (!message) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message[index]); // ❗ 누적 ❌, 현재 글자만 표시
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45000 / message.length);
    return () => clearInterval(interval);
  }, [message]);

  // ✅ 이미지 순차 전환 (30초 후 정지)
  useEffect(() => {
    if (!Array.isArray(selectedImages) || selectedImages.length === 0 || selectedVideo) return;
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
  }, [selectedImages, selectedVideo]);

  // ✅ 음악 30초 후 정지
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
        <div className="message-text">{displayedText}</div>

        {/* ✅ 이미지/영상 정확히 분리 출력 */}
        {selectedVideo && selectedVideo !== "null" ? (
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
        ) : (
          selectedImages.length > 0 && (
            <img
              src={selectedImages[currentImageIndex]}
              alt="preview"
              className="media-display"
            />
          )
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
