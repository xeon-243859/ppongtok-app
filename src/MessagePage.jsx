import React from 'react';

function MessagePage() {
  const messages = [
    { title: '📩 사랑 고백', desc: '마음을 담아 진심을 전해보세요.' },
    { title: '🙏 사과하기', desc: '진심 어린 사과로 마음을 열어보세요.' },
    { title: '🎉 축하하기', desc: '기쁜 순간을 함께 축하해요.' },
    { title: '💌 감사 인사', desc: '고마운 마음을 따뜻하게 전하세요.' },
    { title: '🌈 추억 만들기', desc: '소중한 순간을 함께 기록해요.' },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f9ff', minHeight: '100vh', padding: '2rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', wordBreak: 'keep-all' }}>🎉 뿅!톡을 시작해볼까요?</h2>
      </section>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        {messages.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: '1.5rem',
              width: '90%',
              maxWidth: '400px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, background-color 0.3s',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#e0f7fa';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>{item.title}</h3>
            <p style={{ color: '#555', fontSize: '1rem' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 반응형 글자 크기 조정 */}
      <style>
        {`
          @media (max-width: 600px) {
            h2 {
              font-size: 1.7rem;
              line-height: 1.4;
            }
            h3 {
              font-size: 1.2rem;
            }
            p {
              font-size: 0.95rem;
            }
          }
        `}
      </style>
    </div>
  );
}

export default MessagePage;
