import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const [caption, setCaption] = useState(""); // 자막 전체 문장
  const [displayedCaption, setDisplayedCaption] = useState(""); // 타자기 자막 출력용
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const videoRef = useRef(null);


  // 자막 CSS 애니메이션 정의 (현재 사용 안 함)
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

  // 자막 원문 설정 (최초 1회)
  useEffect(() => {
    const msg = localStorage.getItem("message") || "";
    setCaption(msg);
  }, []);

  // 자막 타자기 효과
  useEffect(() => {
  let intervalId;

  if (caption) {
    let i = 0;
    setDisplayedCaption(""); // 🔥 초기화로 쌓임 방지!

    intervalId = setInterval(() => {
      setDisplayedCaption(caption.slice(0, i));
      i++;
      if (i > caption.length) clearInterval(intervalId);
    }, 250); //숫자를 높일수록 속도가 느려짐//
  }

  return () => clearInterval(intervalId);
}, [caption]);

  // 이미지/영상/음악 등 선택 데이터 가져오기
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
    setSelectedMusic(music);
    
    let slideInterval;
    let stopTimeout;

    if (type === "image" && images.length > 0) {
       slideInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 5000); //5초간격으로 이미지 바뀜//

       stopTimeout = setTimeout(() => {
      clearInterval(slideInterval); // ✅ 30초 후 멈춤
    }, 30000); // 30초
  }
      return () => {
    clearInterval(slideInterval);
    clearTimeout(stopTimeout);
  };
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
            ref={videoRef} // ✅ 추가
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

        {/* 자막 출력: 미디어 로드 완료 후만 출력 */}
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

      {/* 하단 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28 }}>
        <button onClick={() => navigate("/music")} style={buttonStyle}>뒤로가기</button>
        <button onClick={handleNext} style={buttonStyle}>다음 - 공유하기</button>
        <button onClick={handleGoHome} style={buttonStyle}>처음으로</button>
      </div>

      {/* 음악 출력 */}
      {selectedMusic && <audio ref={audioRef} src={selectedMusic} autoPlay />}
    </div>
  );

 useEffect(() => {
  if (mediaType === "video" && videoRef.current) {
    const timeout = setTimeout(() => {
      videoRef.current.pause(); // ✅ 정지
      videoRef.current.currentTime = 0; // ⏮️ 처음으로 되감기 (선택사항)
    }, 30000); // 30초

    return () => clearTimeout(timeout);
  }
}, [mediaType, selectedVideo]);

useEffect(() => {
  const audio = audioRef.current;

  if (!selectedMusic || !audio) return;

  const handleCanPlay = () => {
    // 오디오가 완전히 로드되었을 때 30초 후 정지
    const stopTimeout = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 30000);

    audio.removeEventListener("canplaythrough", handleCanPlay); // 중복 방지
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

  // ✅ audio 재생 시작 후 30초 후 정지
  const stopTimeout = setTimeout(() => {
    audio.pause();               // 정지
    audio.currentTime = 0;       // 선택: 처음으로 되감기
  }, 30000); // 30초

  return () => {
    clearTimeout(stopTimeout);
    audio.pause(); // 페이지 전환 시에도 정지
  };
}, [selectedMusic]);


};

export default PreviewPage;
