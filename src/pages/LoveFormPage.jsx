import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoveFormPage.css';

function LoveFormPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (message.trim()) {
      localStorage.setItem('loveMessage', message);
      navigate('/style/select');
    } else {
      alert('사랑 메시지를 입력해주세요.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="love-form-container">
      <h2 className="typewriter">마음속 사랑을 살며시 남겨보세요.</h2>
      <textarea
        placeholder="당신의 진심을 담은 고백을 여기에 적어주세요…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}

export default LoveFormPage;
