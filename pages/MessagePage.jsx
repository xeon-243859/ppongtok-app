import React from 'react';
import { useRouter } from 'next/router';

export default function MessagePage() {
  const router = useRouter();

  const messages = [
    { title: '사랑 고백', desc: '마음을 전하는 순간을 특별하게.', path: '/love' },
    { title: '축하하기', desc: '소중한 순간을 함께 축하해요.', path: '/celebration' },
    { title: '사과하기', desc: '진심어린 사과로 마음을 전해요.', path: '/apology' },
    { title: '감사하기', desc: '고마운 마음을 전하는 순간.', path: '/thankyou' },
    { title: '추억 만들기', desc: '특별한 순간을 추억으로 남겨요.', path: '/memory' }
  ];

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', wordBreak: 'keep-all' }}>
        어떤 메시지를 만들까요?
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        {messages.map((item, idx) => (
          <div
            key={idx}
            onClick={() => router.push(item.path)}
            style={{
              width: '90%',
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '1rem',
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              fontSize: '1.1rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
