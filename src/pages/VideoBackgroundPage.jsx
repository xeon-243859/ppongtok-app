import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoBackgroundPage.css';

const videos = [
  '/videos/flower.mp4',
  '/videos/river.mp4',
  '/videos/sky.mp4',
  '/videos/sunset.mp4'
];

export default function VideoBackgroundPage({ setSelectedVideo }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (vid) => {
    setSelected(vid);
    setSelectedVideo(vid);
  };

  return (
    <div className="video-background-container">
      <h2>영상 배경을 선택해 주세요</h2>
      <div className="video-preview">
        {selected && (
          <video src={selected} autoPlay muted loop controls width="320" height="180" />
        )}
      </div>
      <div className="video-options">
        {videos.map((vid, index) => (
          <button
            key={index}
            className={selected === vid ? 'selected' : ''}
            onClick={() => handleSelect(vid)}
          >
            영상 {index + 1}
          </button>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={() => navigate('/love/style')}>뒤로가기</button>
        <button onClick={() => navigate('/love/music')} disabled={!selected}>다음으로</button>
      </div>
    </div>
  );
}