import React from 'react';

function ThankYouPage() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f9fff5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌼 감사의 마음을 전해볼까요?</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
        고마운 마음을 따뜻하게 담아 소중한 사람에게 전하세요.
      </p>
      <button
        style={{
          backgroundColor: '#aed581',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9ccc65'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#aed581'}
      >
        메시지 작성하기 ✍️
      </button>
    </div>
  );
}

export default ThankYouPage;
