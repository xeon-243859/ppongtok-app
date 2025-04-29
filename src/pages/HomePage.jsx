import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/messages');
  };

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '5rem',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', wordBreak: 'keep-all' }}>
        🎉 뿅!톡에 오신것을
      </h1>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
        환영합니다 🎉
      </h1>

      <button
        onClick={handleStart}
        style={{
          fontSize: '1.2rem',
          padding: '0.8rem 2.5rem',
          borderRadius: '2rem',
          backgroundColor: '#4fc3f7',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          marginTop: '2rem'
        }}
      >
        시작하기
      </button>
    </div>
  );
}

export default HomePage;
