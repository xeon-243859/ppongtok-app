import React, { useEffect, useState } from 'react';

function LoveFinalPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('love_name') || '';
    const savedMessage = localStorage.getItem('love_message') || '';
    setName(savedName);
    setMessage(savedMessage);
  }, []);

  const handleCopy = () => {
    const fullMessage = `To. ${name}\n\n${message}`;
    navigator.clipboard.writeText(fullMessage)
      .then(() => {
        alert('💌 고백 메시지가 복사되었습니다!');
      })
      .catch(() => {
        alert('⚠️ 복사에 실패했습니다.');
      });
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff0f5',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h2 style={{ 
        fontSize: '2rem', 
        marginBottom: '2rem', 
        color: '#d81b60' 
      }}>
        🎉 고백 메시지 준비 완료! 🎉
      </h2>

      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '2rem', 
        borderRadius: '20px', 
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '400px',
        marginBottom: '2rem'
      }}>
        <p style={{ 
          fontWeight: 'bold', 
          fontSize: '1.4rem', 
          marginBottom: '1rem',
          color: '#ff4081'
        }}>
          To. {name}
        </p>
        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.8', 
          color: '#555', 
          whiteSpace: 'pre-wrap'
        }}>
          {message}
        </p>
      </div>

      <button 
        onClick={handleCopy}
        style={{
          backgroundColor: '#f48fb1',
          border: 'none',
          borderRadius: '25px',
          padding: '0.8rem 2rem',
          fontSize: '1.1rem',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ec407a'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f48fb1'}
      >
        📋 메시지 복사하기
      </button>
    </div>
  );
}

export default LoveFinalPage;
