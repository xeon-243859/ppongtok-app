import React from 'react';
import { useNavigate } from 'react-router-dom';

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/emotion');
  };

  return (
    <div style={{
      height: '100vh',
      background: '#f9f1ff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '"Noto Serif KR", serif',
      textAlign: 'center'
    }}>
      <h1>💌 뿅!톡에 오신 것을 환영합니다</h1>
      <p>지금 당신의 감정을 메시지로 전해보세요</p>
      <button onClick={handleStart} style={{
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        시작하기
      </button>
    </div>
  );
};

export default IntroPage;


