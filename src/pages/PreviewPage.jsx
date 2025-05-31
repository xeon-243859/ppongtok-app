// ✅ PreviewPage.jsx (최종 완성형) - 이미지/영상/자막/음악 반영

import React, { useEffect, useState } from "react";

const PreviewPage = () => {
  const [mediaType, setMediaType] = useState("image");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [music, setMusic] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages"));
    const video = localStorage.getItem("selectedVideo");
    const type = localStorage.getItem("selected-type");
    const storedCaption = localStorage.getItem("caption");
    const storedMusic = localStorage.getItem("selectedMusic");

    if (images) setSelectedImages(images);
    if (video) setSelectedVideo(video);
    if (type) setMediaType(type);
    if (storedCaption) setCaption(storedCaption);
    if (storedMusic) setMusic(storedMusic);
  }, []);

  // 이미지 자동 넘기기
  useEffect(() => {
    if (mediaType === "image" && selectedImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
      }, 3000); // 3초마다 변경
      return () => clearInterval(interval);
    }
  }, [mediaType, selectedImages]);

  // 자막 흐름 반복 처리
  const repeatedMessage = caption ? caption.repeat(20) : "";

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* 배경 렌더링 */}
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
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{ color: "#999" }}>배경이 없습니다</div>
      )}

      {/* 자막 무빙 텍스트 */}
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            width: "100%",
            overflow: "hidden",
            height: "40px",
            whiteSpace: "nowrap",
          }}
        >
          <p
            style={{
              position: "absolute",
              animation: "scrollText 30s linear infinite",
              fontSize: "20px",
              fontWeight: "bold",
              color: "white",
              textShadow: "0 0 6px rgba(0,0,0,0.7)",
            }}
          >
            {repeatedMessage}
          </p>
        </div>
      )}

      {/* 음악 재생 */}
      {music && (
        <audio autoPlay loop src={music} style={{ display: "none" }} />
      )}
    </div>
  );
};

export default PreviewPage;
