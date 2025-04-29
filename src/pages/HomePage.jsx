import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      paddingTop: '20%',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉 뿅!톡에 오신것을</h1>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>환영합니다 🎉</h1>
      <button
        onClick={() => navigate('/messages')}
        style={{
          backgroundColor: '#4FC3F7',
          border: 'none',
          borderRadius: '25px',
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          marginTop: '2rem',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#42a5f5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4FC3F7'}
      >
        시작하기 🚀
      </button>
    </div>
  );
}

export default HomePage;
