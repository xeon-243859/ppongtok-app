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

    {/* ✅ 자막을 맨 위에 출력 */}
    {message && (
      <div className="message-overlay">
        <p>{message}</p>
      </div>
    )}

    {/* ✅ 영상 배경 */}
    {selectedVideo && (
      <video
        className="preview-video"
        src={selectedVideo}
        autoPlay
        loop
        muted
      />
    )}

    {/* ✅ 이미지 배경 */}
    {selectedImage && (
      <img className="preview-image" src={selectedImage} alt="preview" />
    )}

    {/* ✅ 공유 및 저장 버튼들 */}
    <div className="button-container">
      <button>링크 복사</button>
      <button>PDF 저장</button>
      <button>처음으로</button>
      <div>
        <button>Facebook</button>
        <button>Twitter</button>
        <button>KakaoTalk</button>
      </div>
    </div>
  </div>
);
} // ← 이 중괄호가 누락됨


export default PreviewPage;
