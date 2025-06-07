import React from 'react';

export default function LoveConfessionPage() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#fff8f8',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>💖 사랑 고백을 시작해볼까요?</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
        당신의 진심을 담아 소중한 사람에게 특별한 마음을 전하세요.
      </p>
      <button
        style={{
          backgroundColor: '#ff8a80',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff5252'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff8a80'}
      >
        메시지 작성하기 ✍️
      </button>
    </div>
  );
}
