import React from 'react';
import { useNavigate } from 'react-router-dom';

function MessagePage() {
  const navigate = useNavigate();

  const messages = [
    { title: '사랑고백', desc: '마음을 전하는 순간을 특별하게', path: '/love' },
    { title: '축하하기', desc: '소중한 순간을 함께 축하해요', path: '/celebration' },
    { title: '사과하기', desc: '진심 어린 사과를 전해요', path: '/apology' },
    { title: '감사하기', desc: '고마운 마음을 전해봐요', path: '/thankyou' },
    { title: '추억만들기', desc: '소중한 추억을 함께해요', path: '/memory' },
  ];

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '2rem',
        wordBreak: 'keep-all'
      }}>
        어떤 메시지를 만들까요?
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        {messages.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            style={{
              width: '240px', // 카드 폭 줄였음
              height: '120px', // 카드 높이도 작게
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{
              margin: '0.5rem 0',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              wordBreak: 'keep-all'
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#555',
              margin: 0,
              wordBreak: 'keep-all'
            }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagePage;
