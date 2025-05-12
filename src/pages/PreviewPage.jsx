import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [displayedText, setDisplayedText] = useState("");
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

  // ✅ 이미지 4장 순차 전환
  useEffect(() => {
    if (!Array.isArray(selectedImages) || selectedImages.length === 0) return;
    let index = 0;
    setCurrentImageIndex(index); // 첫 이미지 출력

    const displayNext = () => {
      index++;
      if (index < selectedImages.length) {
        setCurrentImageIndex(index);
        setTimeout(displayNext, 5000); // 다음 이미지로 넘어감
      }
    };

    const timer = setTimeout(displayNext, 5000); // 첫 타이머 설정

    return () => clearTimeout(timer); // 정리
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
