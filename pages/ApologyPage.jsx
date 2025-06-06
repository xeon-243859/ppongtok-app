import React from 'react';

function ApologyPage() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5faff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🙏 진심 어린 사과를 전해볼까요?</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
        마음을 담아 진심으로 사과하는 메시지를 전하세요.
      </p>
      <button
        style={{
          backgroundColor: '#81d4fa',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4fc3f7'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#81d4fa'}
      >
        메시지 작성하기 ✍️
      </button>
    </div>
  );
}

export default ApologyPage;
