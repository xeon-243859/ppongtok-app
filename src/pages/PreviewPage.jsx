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
    const bg = localStorage.getItem("selectedBackground");
    const video = localStorage.getItem("selectedVideo");
    const musicFile = localStorage.getItem("selectedMusic");
    const text = localStorage.getItem("subtitle");

    if (video) {
      setBackground(video);
      setIsVideo(true);
    } else if (bg) {
      setBackground(bg);
      setIsVideo(false);
    }

    if (musicFile) setMusic(musicFile);
    if (text) setSubtitle(text);

    // ✅ 카카오 SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("여기에_카카오_Javascript_키"); // 여기에 본인 키 입력!
    }
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
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, "_blank");
  };

  const handleTwitterShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=이 사랑 메시지 너무 감동이에요!`;
    window.open(shareUrl, "_blank");
  };

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("카카오 공유 초기화 오류입니다.");
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '당신에게 전하는 사랑 메시지 💌',
        description: '뿅!톡에서 만든 감성 메시지예요',
        imageUrl: 'https://ppongtok-app.vercel.app/default-thumbnail.jpg', // 실제 썸네일 경로로 교체
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '메시지 보러가기',
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
        {isVideo ? (
          <video className="preview-media" src={background} autoPlay loop muted />
        ) : (
          <img className="preview-media" src={background} alt="배경 이미지" />
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
