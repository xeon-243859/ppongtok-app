// src/pages/LoveFormPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoveFormPage.css';

const emotionThemes = {
  '잔잔한 마음': {
    music: '/audio/spring.mp3',
    background: '/images/lovesky.jpg'
  },
  '설레는 마음': {
    music: '/audio/mueon1.mp3',
    background: '/images/lovelove.png'
  },
  '따뜻한 기억': {
    music: '/audio/mueon.mp3',
    background: '/images/likeyou.png'
  }
};

function LoveFormPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [emotion, setEmotion] = useState('잔잔한 마음');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const handleSubmit = () => {
    const customImage = imageFile ? URL.createObjectURL(imageFile) : null;
    const customAudio = audioFile ? URL.createObjectURL(audioFile) : null;
    const theme = emotionThemes[emotion];

    navigate('/love/generate', {
      state: {
        message,
        emotion,
        customImage,
        customAudio,
        theme
      }
    });
  };

  return (
    <div className="form-container">
      <h2>사랑 메시지를 입력하세요 💖</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="사랑하는 사람에게 전하고 싶은 말을 써보세요"
        rows={5}
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          lineHeight: '1.6',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #ff85a2',
          width: '100%',
          resize: 'none',
        }}
      />

      <div className="select-box">
        <label>감정 선택:</label>
        <select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
          <option value="잔잔한 마음">잔잔한 마음</option>
          <option value="설레는 마음">설레는 마음</option>
          <option value="따뜻한 기억">따뜻한 기억</option>
        </select>
      </div>

      <div className="select-box">
        <label>배경 이미지 업로드:</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <div className="select-box">
        <label>배경 음악 업로드:</label>
        <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
      </div>

      <button onClick={handleSubmit}>사랑 영상 만들기</button>
    </div>
  );
}

export default LoveFormPage;
