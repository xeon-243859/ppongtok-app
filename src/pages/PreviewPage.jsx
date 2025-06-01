import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const captionRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [caption, setCaption] = useState("");
  const [repeatedMessage, setRepeatedMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(null);

  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages") || "[]");
    const video = localStorage.getItem("selected-video");
    const type = localStorage.getItem("selected-type") || "image";
    const msg = localStorage.getItem("message") || "";
    const music = localStorage.getItem("selectedMusic");

    if (!video || video.includes("river") || type !== "video") {
      console.warn("⚠️ 주의: river.mp4 제외됨");
      setSelectedVideo(null);
    } else {
      setSelectedVideo(video);
    }

    setSelectedImages(images);
    setMediaType(type);
    setCaption(msg);
    setRepeatedMessage(msg.repeat(20));
    setSelectedMusic(music);

    if (type === "image" && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }

    const timeout = setTimeout(() => {
      navigate("/share");
    }, 30000); // 30초 후 자동 이동

    return () => clearTimeout(timeout);
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
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : mediaType === "video" && selectedVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            loop
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        ) : (
          <div style={{ color: "#999" }}>🎞️ 배경이 없습니다</div>
        )}

        {caption && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              width: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              padding: "0 20px",
            }}
          >
            <p
              style={{
                display: "inline-block",
                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
                animation: "marquee 30s linear forwards",
              }}
            >
              {repeatedMessage}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28 }}>
        <button onClick={() => navigate("/music")} style={buttonStyle}>
          뒤로가기
        </button>
        <button onClick={handleNext} style={buttonStyle}>
          다음 - 공유하기
        </button>
        <button onClick={handleGoHome} style={buttonStyle}>
          처음으로
        </button>
      </div>

      {selectedMusic && <audio ref={audioRef} src={selectedMusic} autoPlay loop />}
    </div>
  );
};

// ✨ CSS 애니메이션 (전역 스타일에 추가 필요)
const style = document.createElement("style");
style.innerHTML = `
@keyframes marquee {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}
`;
document.head.appendChild(style);

export default PreviewPage;
