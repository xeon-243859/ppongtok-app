import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoveFormPage.css';

const LoveFormPage = () => {
  const [message, setMessage] = useState('');
  const [emotion, setEmotion] = useState('잔잔한 마음');
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/love/generate', { state: { message, emotion } });
  };

  return (
    <div className="form-container">
      <h2>사랑 고백 메시지를 입력하세요</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="당신의 진심을 적어보세요..."
        className="message-input"
      />
      <div className="emotion-select">
        <label>감정 선택: </label>
        <select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
          <option>잔잔한 마음</option>
          <option>설레는 마음</option>
          <option>따뜻한 기억</option>
        </select>
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        사랑 영상 만들기
      </button>
    </div>
  );
};

export default LoveFormPage;
