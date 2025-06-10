import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter

export default function PreviewPage() {
  const router = useRouter();

  const [caption, setCaption] = useState(""); // 자막 전체 문장
  const [displayedCaption, setDisplayedCaption] = useState(""); // 타자기 자막 출력용
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(null);

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // 스타일 애니메이션 삽입 (현재 사용 안함)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // 자막 원문
  useEffect(() => {
    const msg = localStorage.getItem("message") || "";
    setCaption(msg);
  }, []);

  // 타자기 효과
  useEffect(() => {
    let intervalId;
    if (caption) {
      let i = 0;
      setDisplayedCaption("");
      intervalId = setInterval(() => {
        setDisplayedCaption(caption.slice(0, i));
        i++;
        if (i > caption.length) clearInterval(intervalId);
      }, 250);
    }
    return () => clearInterval(intervalId);
  }, [caption]);

  // 이미지/영상/음악 로딩
  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages") || "[]");
    const video = localStorage.getItem("selected-video");
    const type = localStorage.getItem("selected-type") || "image";
    const msg = localStorage.getItem("message") || "";
    const music = localStorage.getItem("selectedMusic");

    if (!video || video.includes("river") || type !== "video") {
      setSelectedVideo(null);
    } else {
      setSelectedVideo(video);
    }

    setSelectedImages(images);
    setMediaType(type);
    setCaption(msg);
    setSelectedMusic(music);

    let slideInterval;
    let stopTimeout;

    if (type === "image" && images.length > 0) {
      slideInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 5000);

      stopTimeout = setTimeout(() => {
        clearInterval(slideInterval);
      }, 30000);
    }

    return () => {
      clearInterval(slideInterval);
      clearTimeout(stopTimeout);
    };
  }, []);

  // 비디오 30초 정지
  useEffect(() => {
    if (mediaType === "video" && videoRef.current) {
      const timeout = setTimeout(() => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [mediaType, selectedVideo]);

  // 오디오 재생 및 정지
  useEffect(() => {
    const audio = audioRef.current;
    if (!selectedMusic || !audio) return;

    const handleCanPlay = () => {
      const stopTimeout = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 30000);
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };

    audio.addEventListener("canplaythrough", handleCanPlay);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, [selectedMusic]);

  useEffect(() => {
    if (!selectedMusic) return;
    const audio = audioRef.current;
    if (!audio) return;
    const stopTimeout = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 30000);
    return () => {
      clearTimeout(stopTimeout);
      audio.pause();
    };
  }, [selectedMusic]);

  const handleNext = () => router.push("/sharepage");
  const handleGoHome = () => router.push("/");

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
          maxWidth: "720px",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: "24px",
          backgroundColor: "#000",
        }}
      >
        {mediaType === "image" && selectedImages.length > 0 ? (
          <img
            src={selectedImages[currentImageIndex]}
            alt="선택된 이미지"
            onLoad={() => setMediaLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        ) : mediaType === "video" && selectedVideo ? (
          <video
            ref={videoRef}
            src={selectedVideo}
            autoPlay
            muted
            onCanPlay={() => setMediaLoaded(true)}
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

        {caption && mediaLoaded && (
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              width: "100%",
              textAlign: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              textShadow: "0 0 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {displayedCaption}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28 }}>
        <button onClick={() => router.push("/musicselectpage")} style={buttonStyle}>뒤로가기</button>
        <button onClick={handleNext} style={buttonStyle}>다음 - 공유하기</button>
        <button onClick={handleGoHome} style={buttonStyle}>처음으로</button>
      </div>

      {selectedMusic && <audio ref={audioRef} src={selectedMusic} autoPlay />}
    </div>
  );
}


