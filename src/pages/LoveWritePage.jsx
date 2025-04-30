import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoveWritePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !message) return alert('이름과 메시지를 모두 입력해주세요!');
    localStorage.setItem('love_name', name);
    localStorage.setItem('love_message', message);
    console.log('작성 완료:', { name, message });
    navigate('/love/preview');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2>💌 사랑 고백 메시지 작성 💌</h2>
      <div style={{ margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem', width: '80%', maxWidth: '300px', fontSize: '1rem' }}
        />
      </div>
      <div style={{ margin: '1rem 0' }}>
        <textarea
          placeholder="마음을 담은 메시지를 적어보세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          style={{ padding: '0.5rem', width: '80%', maxWidth: '300px', fontSize: '1rem' }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#FF8A80',
          border: 'none',
          borderRadius: '20px',
          padding: '0.6rem 1.5rem',
          fontSize: '1rem',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
        }}
      >
        미리보기로 이동 📝
      </button>
    </div>
  );
}

export default LoveWritePage;
