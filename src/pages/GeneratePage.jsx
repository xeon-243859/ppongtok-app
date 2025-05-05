// src/pages/GeneratePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneratePage.css';

function GeneratePage({ message, selectedImage, selectedVideo, selectedMusic }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [selectedMusic]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert("링크가 복사되었습니다! 친구에게 붙여넣기 해보세요 ✨");
        setShareUrl(url);
      })
      .catch(() => alert("복사에 실패했습니다. 다시 시도해주세요."));
  };

  return (
    <div className="generate-page">
      <h2>내가 만든 사랑 고백</h2>

      <div className="preview-box">
        {selectedVideo ? (
          <video ref={videoRef} src={selectedVideo} autoPlay muted loop className="background-video" />
        ) : (
          <img src={selectedImage} alt="배경 이미지" className="background-image" />
        )}

        <div className="overlay-text">
          <p>{message}</p>
        </div>
      </div>

      <div className="music-control">
        {selectedMusic && <audio ref={audioRef} src={selectedMusic} controls loop />}
      </div>

      <div className="navigation-buttons">
        <button onClick={() => navigate('/')}>다시 만들기</button>
        <button onClick={handleShare}>🔗 공유하기</button>
      </div>
    </div>
  );
}

export default GeneratePage;
