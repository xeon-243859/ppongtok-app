import React, { useEffect, useState } from 'react';
import './GeneratePage.css';

function GeneratePage() {
  const message = localStorage.getItem('loveMessage') || '';
  const images = JSON.parse(localStorage.getItem('selectedImages') || '[]');
  const video = localStorage.getItem('selectedVideo');
  const audio = localStorage.getItem('selectedAudio');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const messageLines = message.split(/[.!?]\s*/).filter(Boolean);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 5000); // 5초 간격으로 슬라이드
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <div className="generate-container">
      {audio && <audio src={audio} autoPlay loop />}

      <div className="media-box">
        {video ? (
          <video src={video} autoPlay muted loop />
        ) : (
          images.length > 0 && (
            <img src={images[currentImageIndex]} alt={`배경${currentImageIndex}`} />
          )
        )}

        <div className="subtitle-box">
          {messageLines.map((line, index) => (
            <span
              key={index}
              className="subtitle"
              style={{ animationDelay: `${index * (20 / messageLines.length)}s` }}
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      <div className="share-buttons">
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>🔗 링크 복사</button>
        <button onClick={() => window.print()}>📄 PDF 저장</button>
        <button onClick={() => alert('이미지 저장 준비 중입니다')}>🖼 이미지 저장</button>
        <button onClick={() => alert('페이스북 공유')}>📘 페이스북</button>
        <button onClick={() => alert('트위터 공유')}>🐦 트위터</button>
        <button onClick={() => window.history.back()}>🔙 뒤로가기</button>
        <button onClick={() => window.location.href = '/'}>🔄 다시 만들기</button>
      </div>
    </div>
  );
}

export default GeneratePage;
