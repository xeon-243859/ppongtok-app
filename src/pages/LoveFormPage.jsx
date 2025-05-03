import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoveFormPage.css';

const LoveFormPage = () => {
  const [message, setMessage] = useState('');
  const [music, setMusic] = useState('love-theme.mp3');
  const [background, setBackground] = useState('love-background.jpg');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!message.trim()) {
      alert('사랑 메시지를 입력해주세요.');
      return;
    }
    localStorage.setItem('message', message);
    localStorage.setItem('music', music);
    localStorage.setItem('background', background);
    navigate('/love/generate');
  };

  return (
    <div className="form-container">
      <h2>사랑 메시지를 입력하세요</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="당신의 마음을 담아보세요..."
      />

      <h3>음악 선택</h3>
      <select value={music} onChange={(e) => setMusic(e.target.value)}>
        <option value="love-theme.mp3">기본 러브 테마</option>
        <option value="calm-heart.mp3">잔잔한 마음</option>
        <option value="soft-dream.mp3">부드러운 꿈</option>
      </select>

      <h3>배경 이미지 선택</h3>
      <div className="image-select">
        <img src="/images/love-background.jpg" onClick={() => setBackground('love-background.jpg')} alt="배경1" />
        <img src="/images/love-bg2.jpg" onClick={() => setBackground('love-bg2.jpg')} alt="배경2" />
        <img src="/images/love-bg3.jpg" onClick={() => setBackground('love-bg3.jpg')} alt="배경3" />
      </div>

      <button onClick={handleSubmit}>사랑 영상 만들기</button>
    </div>
  );
};

export default LoveFormPage;
