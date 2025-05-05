// LoveFormPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoveFormPage.css';

function LoveFormPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleNext = () => {
    if (message.trim() !== '') {
      localStorage.setItem('loveMessage', message);
      navigate('/style/select');
    } else {
      alert('사랑의 메시지를 입력해주세요!');
    }
  };

  return (
    <div className="form-container">
      <h2>💌 마음속 사랑을 살며시 남겨보세요.</h2>
      <textarea
        value={message}
        onChange={handleChange}
        placeholder="당신의 진심을 담은 고백을 여기에 적어주세요…"
      />
      <button className="next-button" onClick={handleNext}>
        다음으로
      </button>
    </div>
  );
}

export default LoveFormPage;
