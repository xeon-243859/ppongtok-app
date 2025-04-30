import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LovePreviewPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('love_name') || '이름 없음';
    const savedMessage = localStorage.getItem('love_message') || '메시지 없음';
    setName(savedName);
    setMessage(savedMessage);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>✨ 당신의 고백 메시지 ✨</h2>
      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        width: '90%',
        maxWidth: '400px',
        margin: '0 auto',
        lineHeight: '1.6'
      }}>
        <strong>{name}</strong>님이 보낸 메시지:<br />
        <em>{message}</em>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/love/final')}
          style={{
            backgroundColor: '#4FC3F7',
            border: 'none',
            borderRadius: '25px',
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            color: '#fff',
            cursor: 'pointer',
            margin: '0 1rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s ease'
          }}
        >
          확정하기 💖
        </button>

        <button
          onClick={() => navigate('/love/write')}
          style={{
            backgroundColor: '#ffb74d',
            border: 'none',
            borderRadius: '25px',
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            color: '#fff',
            cursor: 'pointer',
            margin: '0 1rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s ease'
          }}
        >
          다시쓰기 🔄
        </button>
      </div>
    </div>
  );
}

export default LovePreviewPage;
