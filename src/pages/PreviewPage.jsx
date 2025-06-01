import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [caption, setCaption] = useState("");
  const [repeatedMessage, setRepeatedMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false); // ✅ 로딩 상태

  // 자막 애니메이션 정의
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scrollText {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 초기값 불러오기
  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages") || "[]");
    const video = localStorage.getItem("selectedVideo");
    const type = localStorage.getItem("selected-type") || "image";
    const msg = localStorage.getItem("message") || "";
    const music = localStorage.getItem("selectedMusic");

    setSelectedImages(images);
    setSelectedVideo(video);
    setMediaType(type);
    setCaption(msg);
    setSelectedMusic(music);
    setRepeatedMessage(msg.repeat(5)); // ✅ 반복 횟수 줄임

    if (type === "image" && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleNext = () => navigate("/share");
  const handleGoHome = () => navigate("/");

  const buttonStyle = {
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ff8fab",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>💌 미리보기</h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 600,
          height: 360,
          background: "#000",
          borderRadius: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {mediaType === "image" && selectedImages.length > 0 ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="preview"
            onLoad={() => setIsMediaLoaded(true)} // ✅ 이미지 로딩 완료 시
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : mediaType === "video" && selectedVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            loop
            controls
            onLoadedData={() => setIsMediaLoaded(true)} // ✅ 영상 로딩 완료 시
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "16px",
              backgroundColor: "#000",
            }}
          />
        ) : (
          <div style={{ color: "#999" }}>🎞️ 배경이 없습니다</div>
        )}

        {/* 자막: 로딩 완료된 후에만 표시 */}
        {repeatedMessage && isMediaLoaded && (
          <div
            style={{
              position: "absolute",
              bottom: 24,
              width: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              height: "40px",
            }}
          >
            <p
              style={{
                position: "absolute",
                animation: "scrollText 90s linear infinite", // ✅ 느리게 흐름
                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
                textShadow: "0 0 6px rgba(0,0,0,0.7)",
              }}
            >
              {repeatedMessage}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/music")} style={buttonStyle}>뒤로가기</button>
        <button onClick={handleNext} style={buttonStyle}>다음 - 공유하기</button>
        <button onClick={handleGoHome} style={buttonStyle}>처음으로</button>
      </div>

      {selectedMusic && (
        <audio ref={audioRef} src={selectedMusic} autoPlay loop />
      )}
    </div>
  );
};

export default PreviewPage;
