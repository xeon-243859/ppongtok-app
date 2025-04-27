import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MessagePage() {
  const navigate = useNavigate();
  const [showMessages, setShowMessages] = useState(false);

  const messages = [
    { title: '사랑 고백', desc: '마음을 담아 진심을 전해보세요.', path: '/love' },
    { title: '사과 메시지', desc: '진심 어린 사과로 마음을 열어보세요.', path: '/apology' },
    { title: '축하 메시지', desc: '기쁜 순간을 함께 축하해요.', path: '/celebration' },
    { title: '감사 메시지', desc: '고마운 마음을 따뜻하게 전하세요.', path: '/thankyou' },
    { title: '추억 만들기', desc: '소중한 순간을 함께 기록해요.', path: '/memory' },
  ];

  const handleStart = () => {
    setShowMessages(true);
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f9ff',
        minHeight: '100vh',
        padding: '2rem',
        overflow: 'visible',
        textAlign: 'center',
      }}
    >
      {!showMessages ? (
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🎉 뿅!톡을 시작해볼까요?</h2>
          <button
            onClick={handleStart}
            style={{
              fontSize: '1.2rem',
              padding: '0.8rem 2rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#4338ca')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4f46e5')}
          >
            시작하기
          </button>
        </div>
      ) : (
        <div
          style={{
            animation: 'fadeIn 0.8s ease forwards',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          {messages.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              style={{
                padding: '1.5rem',
                width: '90%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                textAlign: 'center',
                cursor: 'pointer',
                opacity: 0,
                animation: `fadeInCard 0.5s ease ${idx * 0.2}s forwards`,
              }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: '#555' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}
      {/* 애니메이션 키프레임 */}
      <style>
        {`
          @keyframes fadeInCard {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default MessagePage;
