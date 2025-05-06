import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import "./PreviewPage.css";

function PreviewPage() {
  const [background, setBackground] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [music, setMusic] = useState(null);
  const [subtitle, setSubtitle] = useState("");
  const previewRef = useRef(null);

  useEffect(() => {
    const selectedImage = localStorage.getItem("selectedBackground");
    const selectedVideo = localStorage.getItem("selectedVideo");
    const selectedMusic = localStorage.getItem("selectedMusic");
    const savedSubtitle = localStorage.getItem("subtitle");

    if (selectedVideo) {
      setBackground(selectedVideo);
      setIsVideo(true);
    } else if (selectedImage) {
      setBackground(selectedImage);
      setIsVideo(false);
    }

    if (selectedMusic) setMusic(selectedMusic);
    if (savedSubtitle) setSubtitle(savedSubtitle);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  const handleSavePDF = () => {
    const element = previewRef.current;
    html2pdf().from(element).save("ppongtok-love-message.pdf");
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=이 사랑 메시지 너무 감동이에요!`, "_blank");
  };

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("카카오톡 공유를 사용할 수 없습니다.");
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "당신에게 전하는 사랑 메시지 💌",
        description: "뿅!톡에서 만든 감성 메시지예요",
        imageUrl: "https://ppongtok-app.vercel.app/default-thumbnail.jpg", // 썸네일 이미지 수정 가능
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "메시지 보러가기",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  return (
    <div className="preview-container">
      <div className="preview-box" ref={previewRef}>
        {background ? (
          isVideo ? (
            <video className="preview-media" src={background} autoPlay loop muted playsInline />
          ) : (
            <img className="preview-media" src={background} alt="배경 이미지" />
          )
        ) : (
          <p>배경이 설정되지 않았습니다.</p>
        )}
        <div className="subtitle-overlay">{subtitle}</div>
      </div>

      {music && (
        <audio autoPlay loop src={music} className="preview-audio" />
      )}

      <div className="button-group">
        <button onClick={handleCopyLink}>🔗 링크 복사</button>
        <button onClick={handleSavePDF}>📄 PDF 저장</button>
        <button onClick={handleFacebookShare}>📘 페이스북 공유</button>
        <button onClick={handleTwitterShare}>🐦 트위터 공유</button>
        <button onClick={handleKakaoShare}>💬 카카오톡 공유</button>
      </div>
    </div>
  );
}

export default PreviewPage;
