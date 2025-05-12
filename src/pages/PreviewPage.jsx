import React, { useEffect, useState } from "react";
import "./PreviewPage.css";

const selectedImage = localStorage.getItem("selected-image");
const selectedVideo = localStorage.getItem("selected-video");
const selectedMusic = localStorage.getItem("selected-music");
const message = localStorage.getItem("message");

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [music, setMusic] = useState("");
  const [ready, setReady] = useState(false); // 🔥 이게 핵심!

  useEffect(() => {
    const msg = localStorage.getItem("message");
    const img = localStorage.getItem("selected-image");
    const vid = localStorage.getItem("selected-video");
    const mus = localStorage.getItem("selected-music");

    console.log("📝 메시지:", msg);
    console.log("🎥 영상:", vid);
    console.log("🎵 음악:", mus);

    setMessage(msg || "");
    setImage(img || "");
    setVideo(vid || "");
    setMusic(mus || "");
    setReady(true); // ✔️ 값이 모두 설정된 후 렌더링 허용
  }, []);

  if (!ready) return null; // 로딩 중이면 아무것도 렌더링 안 함

  return (
    <div className="preview-page">
       {selectedImage && (
      <img
        src={`/backgrounds/${selectedImage}`}
        alt="Selected Background"
        className="background-image"
      />
    )}

    {selectedVideo && (
      <video
        src={`/videos/${selectedVideo}`}
        autoPlay
        muted
        loop
        className="background-video"
      />
    )}
    {/* ✅ 여기까지 복붙! */}
      {/* 🎨 이미지 또는 영상 중 하나만 표시 */}
      {image && !video && (
        <img src={image} alt="선택된 이미지" className="preview-background" />
      )}
      {video && !image && (
        <video
          className="preview-background"
          autoPlay
          loop
          muted
          key={video}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      {/* ✨ 메시지 */}
      <div className="preview-subtitle">{message}</div>

      {/* 🎵 음악 */}
      {music && (
        <audio autoPlay loop key={music}>
          <source src={music} type="audio/mp3" />
        </audio>
      )}
    </div>
  );
};

export default PreviewPage;
