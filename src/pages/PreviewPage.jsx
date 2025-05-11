import React, { useEffect, useState } from "react";
import "./PreviewPage.css"; // ✅ 경로 수정 완료

function PreviewPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const img = localStorage.getItem("selected-image");
    const vid = localStorage.getItem("selected-video");
    const msg = localStorage.getItem("message");

    setSelectedImage(img || "");
    setSelectedVideo(vid || "");
    setMessage(msg || "");
  }, []);

  return (
    <div className="preview-page">
      {/* ✅ 이미지 또는 영상 중 하나만 출력 */}
      {selectedImage && !selectedVideo && (
        <img
          src={selectedImage}
          alt="배경 이미지"
          className="preview-background"
        />
      )}
      {selectedVideo && !selectedImage && (
        <video
          className="preview-background"
          autoPlay
          loop
          muted
        >
          <source src={selectedVideo} type="video/mp4" />
          동영상을 불러오는 중입니다...
        </video>
      )}

      {/* ✅ 자막 표시 */}
      <div className="preview-subtitle">
        {message}
      </div>

      {/* ✅ 공유 버튼 */}
      <div className="preview-buttons">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          링크 복사하기
        </button>
      </div>
    </div>
  );
}

export default PreviewPage;
