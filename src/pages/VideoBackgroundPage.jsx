// src/pages/VideoBackgroundPage.jsx
import React from 'react';
import '../styles/VideoBackgroundPage.css';
import { useNavigate } from 'react-router-dom';

const VideoBackgroundPage = () => {
  const navigate = useNavigate();

  const handleVideoSelect = (videoName) => {
    console.log(`Selected video: ${videoName}`);
    navigate('/music');
  };

  return (
    <div className="video-background-container">
      <h2 className="video-question">네번째 화면 - 영상배경화면</h2>
      <p className="video-subtitle">어떤 배경으로 사랑을 담아볼까요?</p>
      <div className="video-style-buttons">
        <button onClick={() => handleVideoSelect('warm')} className="style-button">따뜻한</button>
        <button onClick={() => handleVideoSelect('romantic')} className="style-button">설레임</button>
        <button onClick={() => handleVideoSelect('calm')} className="style-button">그리움</button>
        <button onClick={() => handleVideoSelect('emotional')} className="style-button">감성적인</button>
        <button onClick={() => handleVideoSelect('upload')} className="upload-button">내 파일 선택</button>
      </div>
      <div className="video-preview-box"></div>
      <div className="nav-buttons">
        <button onClick={() => navigate('/style/select')} className="nav-button">뒤로가기</button>
        <button onClick={() => navigate('/music')} className="nav-button next">다음으로</button>
      </div>
    </div>
  );
};

export default VideoBackgroundPage;
