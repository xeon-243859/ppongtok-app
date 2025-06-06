import React from 'react';
import './GeneratePage.css';

export default function GeneratePage({ message, selectedImage, selectedVideo, selectedMusic }) {
  return (
    <div className="generate-container">
      <h2>완성된 사랑 메시지를 확인해 보세요!</h2>

      {selectedMusic && (
        <audio src={selectedMusic} autoPlay loop controls className="audio-player" />
      )}

      {selectedVideo ? (
        <video src={selectedVideo} autoPlay loop muted controls className="media-preview" />
      ) : selectedImage ? (
        <img src={selectedImage} alt="선택된 이미지" className="media-preview" />
      ) : null}

      <div className="message-box">
        <p>{message}</p>
      </div>

      <div className="share-buttons">
        <button>📄 PDF 저장</button>
        <button>🔗 링크 복사</button>
        <button>📷 이미지 저장</button>
        <button>📢 페이스북 공유</button>
      </div>
    </div>
  );
}
