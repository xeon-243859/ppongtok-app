import { useRef } from 'react';

export default function App() {
  const startSectionRef = useRef(null);

  const handleStartClick = () => {
    startSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#e0f7fa', minHeight: '100vh' }}>
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '1rem',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          margin: '0 0 1rem 0',
          wordBreak: 'keep-all',
        }}>
          ⚠️ 환영합니다.<br />뿅!톡에 오신것을!
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
          React 기반 감성 메시지 앱입니다.<br />
          <span style={{ fontSize: '1rem' }}>by 보리보리 & 크세온 💗</span>
        </p>
        <button 
          onClick={handleStartClick}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1.2rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}>
          시작하기 🚀
        </button>
      </section>

      <section ref={startSectionRef} style={{
        padding: '3rem 1rem',
        textAlign: 'center',
        backgroundColor: '#ffffff',
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          🎉 뿅!톡을 시작해볼까요?
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          alignItems: 'center',
        }}>
          <div style={{
            padding: '1.5rem',
            width: '90%',
            maxWidth: '400px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3>📩 사랑 고백</h3>
            <p style={{ fontSize: '1rem' }}>마음을 전하는 순간을 특별하게 만들어봐요.</p>
          </div>

          <div style={{
            padding: '1.5rem',
            width: '90%',
            maxWidth: '400px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3>🎉 축하 메시지</h3>
            <p style={{ fontSize: '1rem' }}>기쁨의 순간을 함께 나눠요.</p>
          </div>
        </div>
      </section>

      {/* 추가: 반응형 글자 크기 조정 */}
      <style>
        {`
          @media (max-width: 600px) {
            h1 {
              font-size: 2rem;
              line-height: 1.3;
            }
          }
        `}
      </style>
    </div>
  );
}
