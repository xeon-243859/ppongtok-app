import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState("");
  const [repeatedMessage, setRepeatedMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(null);

  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages") || "[]");
    const video = localStorage.getItem("selectedVideo");
    const type = localStorage.getItem("mediaType");
    const msg = localStorage.getItem("message");
    const music = localStorage.getItem("selectedMusic");

    setSelectedImages(images);
    setSelectedVideo(video);
    setMediaType(type);
    setCaption(msg || "");
    setSelectedMusic(music);

    if (msg) {
      setRepeatedMessage(msg.repeat(50));
    }

    if (type === "image" && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleNext = () => {
    navigate("/share");
  };

  const handleGoHome = () => {
    navigate("/");
  };

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
    <div
      className="preview-wrapper"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 24 }}
    >
      <h2 style={{ marginBottom: 16 }}>💌 미리보기</h2>

      <div
        className="moving-box"
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: 16,
          textAlign: "center",
        }}
      >
        {mediaType === "image" && selectedImages.length > 0 ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="preview"
            style={{ width: "100%", borderRadius: 16 }}
          />
        ) : mediaType === "video" && selectedVideo ? (
          <video
            src={selectedVideo}
            autoPlay
            muted
            playsInline
            style={{ width: "100%", borderRadius: 16 }}
            onLoadedMetadata={(e) => {
              e.target.currentTime = 0;
              setTimeout(() => e.target.pause(), 30000); // 30초 재생 제한
            }}
          />
        ) : (
          <div style={{ height: 200, display: "flex", justifyContent: "center", alignItems: "center", color: "#999" }}>
            배경이 없습니다
          </div>
        )}

        <div
          style={{
            marginTop: 16,
            height: 32,
            overflow: "hidden",
            whiteSpace: "nowrap",
            lineHeight: "32px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              animation: "scrollText 30s linear infinite",
              fontSize: 18,
            }}
          >
            {repeatedMessage}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
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

export default PreviewPage;

