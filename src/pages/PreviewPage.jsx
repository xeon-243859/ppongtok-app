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
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  // 애니메이션 정의 (자막 흐름)
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

  // 초기 미디어/자막 정보 불러오기
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
    setRepeatedMessage(msg.repeat(5)); // 자막 반복

    // 30초 후 자동으로 다음 페이지 이동
    const timeout = setTimeout(() => {
      navigate("/share");
    }, 30000);

    return () => clearTimeout(timeout);
  }, []);

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
            src={selectedImages[0]} // 첫 번째 이미지 고정
            alt="preview"
            onLoad={() => setIsMediaLoaded(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : mediaType === "video" && selectedVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            loop
            controls
            onLoadedData={() => setIsMediaLoaded(true)}
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

        {/* 자막: 미디어 로딩 완료 시 즉시 출력 */}
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
                animation: "scrollText 90s linear infinite",
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
        <button onClick={handleGoHome} style={buttonStyle}>처음으로</button>
      </div>

      {selectedMusic && (
        <audio ref={audioRef} src={selectedMusic} autoPlay loop />
      )}
    </div>
  );
};

export default PreviewPage;
