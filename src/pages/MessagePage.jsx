import React from 'react';
import { useNavigate } from 'react-router-dom';

function MessagePage() {
  const navigate = useNavigate();

  console.log('✅ 메시지 갯수:', messages.length);
  const messages = [
    { title: '사랑 고백', desc: '마음을 전하는 순간을 특별하게 만들어봐요.', path: '/love' },
    // ✨ 여기 **하나만** 있어야 해
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', overflow: 'visible' }}>
      <h2 style={{ marginBottom: '2rem' }}>🎉 뿅!톡을 시작해볼까요?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
        {messages.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ color: '#555' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagePage;
