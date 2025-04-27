import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/message');
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#e0f7fa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      <h2
        style={{
          fontSize: '5vw', // 📱 모바일에서도 반응형 크기
          maxWidth: '90%', 
          whiteSpace: 'nowrap', // ❗ 줄바꿈 없애기
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: '2rem'
        }}
      >
        🎉 뿅!톡을 시작해볼까요?
      </h2>

      <button
        onClick={handleStart}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          borderRadius: '0.8rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        시작하기 🚀
      </button>
    </div>
  );
}

export default HomePage;
