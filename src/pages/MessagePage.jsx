import React from 'react';
import { useNavigate } from 'react-router-dom';

function MessagePage() {
  const navigate = useNavigate();

  const messages = [
    { title: '사랑 고백', desc: '마음을 담아 진심을 전해보세요.', path: '/love' },
    { title: '사과 메시지', desc: '진심 어린 사과로 마음을 열어보세요.', path: '/apology' },
    { title: '축하 메시지', desc: '기쁜 순간을 함께 축하해요.', path: '/celebration' },
    { title: '감사 메시지', desc: '고마운 마음을 따뜻하게 전하세요.', path: '/thankyou' },
    { title: '추억 만들기', desc: '소중한 순간을 함께 기록해요.', path: '/memory' }, // 그대로 memory 경로 사용
  ];

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', wordBreak: 'keep-all' }}>
          🎉 뿅!톡을 시작해볼까요?
        </h2>
      </section>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        overflow: 'visible'
      }}>
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
              cursor: 'pointer'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '1rem', color: '#666' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagePage;
