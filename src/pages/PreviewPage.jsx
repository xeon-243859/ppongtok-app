// ✅ 완성된 PreviewPage.jsx (모바일 대응 + 이미지/영상 충돌 해결 + 타자 애니메이션 + 슬롯 제거 + 이미지 노출 오류 수정)
import React, { useEffect, useState, useRef } from "react";
import "./PreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaType, setMediaType] = useState("none");

  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const selectedType = localStorage.getItem("selected-type");
  const audioRef = useRef(null);

  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  useEffect(() => {
    // 타자 효과 메시지 출력
    if (!message) return;
    let index = 0;
    setTypedMessage("");
    const interval = setInterval(() => {
      setTypedMessage((prev) => prev + message.charAt(index));
      index++;
      if (index >= message.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("selected-images") || "[]");

    if (selectedType === "video") {
      for (let i = 1; i <= 4; i++) {
        localStorage.removeItem(`img-${i}`);
      }
    } else if (selectedType === "image") {
      localStorage.removeItem("selected-video");
    }

    if (selectedType === "video" && selectedVideo) {
      setMediaType("video");
    } else if (selectedType === "image" && storedImages.length > 0) {
      setSelectedImages(storedImages);
      setMediaType("image");
    } else {
      setMediaType("none");
    }
  }, []);

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

  return (
    <div className="preview-page">
      <div className="media-box">
        <div className="moving-box">
          {mediaType === "video" ? (
            <video
              src={selectedVideo}
              autoPlay
              muted
              className="media-display"
              playsInline
              onLoadedMetadata={(e) => {
                e.target.currentTime = 0;
                setTimeout(() => {
                  e.target.pause();
                }, 30000);
              }}
            />
          ) : mediaType === "image" && selectedImages[currentImageIndex] ? (
            <img
              src={selectedImages[currentImageIndex]}
              alt="preview"
              className="media-display"
              loading="eager"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              onError={(e) => {
                console.error("❌ 이미지 로딩 실패:", e.target.src);
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="media-fallback">배경이 없습니다</div>
          )}

          <div className="scrolling-message top-aligned">{typedMessage}</div>
        </div>
      </div>

      <div className="button-box below-box" style={{ display: "flex" }}>
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

      {selectedMusic && <audio src={selectedMusic} autoPlay ref={audioRef} />}
    </div>
  );
};

export default PreviewPage;
