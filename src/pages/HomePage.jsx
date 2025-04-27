// 2025-04-28 수정 by 보리
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    setTimeout(() => {
      navigate('/messages');   // ✅ 시작 후 메시지 선택 화면으로 이동!
    }, 700); // 0.7초 후 부드럽게 이동
  };

  return (
    <div 
      style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', height: '100vh', background: '#e0f7fa',
        overflow: 'hidden'
      }}
    >
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
        🎉 환영합니다! <br /> 뿅!톡에 오신 것을!
      </h1>

      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        React 기반 감성 메시지 앱입니다.
      </p>

      <button 
        onClick={handleStart}
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          fontSize: '1.5rem',
          borderRadius: '1.5rem',
          background: isStarted ? '#4caf50' : '#2196f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.5s ease, background 0.5s ease',
          transform: isStarted ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {isStarted ? '🚀 뿅!' : '시작하기 🚀'}
      </button>
    </div>
  );
}

export default HomePage;
