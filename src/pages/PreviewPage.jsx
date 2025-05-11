import React, { useEffect, useState } from "react";
import "../styles/PreviewPage.css";

function PreviewPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const img = localStorage.getItem("selected-image");
    const vid = localStorage.getItem("selected-video");
    const msg = localStorage.getItem("message");

    // 콘솔 확인용
    console.log("이미지:", img);
    console.log("영상:", vid);
    console.log("메시지:", msg);

    setSelectedImage(img);
    setSelectedVideo(vid);
    setMessage(msg);
  }, []);

  return (
    <div className="preview-container">
      {/* ✅ 이미지 있을 때만 이미지 출력 */}
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Selected Background"
          className="background-media"
        />
      )}

      {/* ✅ 이미지 없고, 영상 있을 때만 영상 출력 */}
      {!selectedImage && selectedVideo && (
        <video
          src={selectedVideo}
          className="background-media"
          autoPlay
          loop
          muted
        />
      )}

      {/* ✅ 메시지가 있을 경우 자막으로 출력 */}
      {message && (
        <div className="message-overlay">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default PreviewPage;

// 🔁 Triggered redeploy to fix message overlay z-index