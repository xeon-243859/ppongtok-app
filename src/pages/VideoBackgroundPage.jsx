import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoBackgroundPage.css';

const defaultVideos = [
  '/videos/flower.mp4',
  '/videos/river.mp4',
  '/videos/sky.mp4',
  '/videos/sunset.mp4',
];

function VideoBackgroundPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const handleSelectVideo = (src) => {
    setSelectedVideo(src);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
    }
  };

  const handleNext = () => {
    if (selectedVideo) {
      localStorage.setItem('selectedVideo', selectedVideo);
      navigate('/love/music');
    } else {
      alert('하나의 배경 영상을 선택해주세요.');
    }
  };

  const handleBack = () => {
    navigate('/love/image');
  };

  return (
    <div className="video-bg-container">
      <h2>영상배경화면</h2>

      <div className="style-buttons">
        <button onClick={() => handleSelectVideo(defaultVideos[0])}>따뜻한</button>
        <button onClick={() => handleSelectVideo(defaultVideos[1])}>설레임</button>
        <button onClick={() => handleSelectVideo(defaultVideos[2])}>그리움</button>
        <button onClick={() => handleSelectVideo(defaultVideos[3])}>감성적인</button>
      </div>

      <label className="upload-box">
        내 파일 선택
        <input type="file" accept="video/*" onChange={handleFileChange} hidden />
      </label>

      <div className="video-preview-box">
        {selectedVideo && (
          <video src={selectedVideo} controls autoPlay muted loop />
        )}
      </div>

      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}

export default VideoBackgroundPage;
