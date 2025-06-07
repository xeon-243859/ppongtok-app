import React from 'react';

export default function CelebrationPage() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#fffdf5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 축하 메시지를 전해볼까요?</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
        축하하는 마음을 따뜻하게 담아 특별한 순간을 함께하세요.
      </p>
      <button
        style={{
          backgroundColor: '#ffd54f',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffca28'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffd54f'}
      >
        메시지 작성하기 ✍️
      </button>
    </div>
  );
}
