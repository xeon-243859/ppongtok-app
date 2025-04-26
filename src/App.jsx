import { useRef, useEffect } from 'react';

function App() {
  const startRef = useRef(null);

  const scrollToStart = () => {
    startRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
      card.classList.add('fade-in-up');
    });
  }, []);

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px', 
      background: 'linear-gradient(to bottom, #e0f7fa, #ffffff)',
      minHeight: '100vh'
    }}>
      {/* 환영 메시지 */}
      <h1 style={{ whiteSpace: 'pre-line', fontSize: '2.5rem', marginBottom: '20px' }}>
        ⚠️ 환영합니다.
        {'\n'}
        뿅!톡에 오신것을!
      </h1>

      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        React 기반 감성 메시지 앱입니다.
        <br />by 보리보리 & 크세온 💖
      </p>

      {/* 시작하기 버튼 */}
      <button 
        onClick={scrollToStart} 
        style={{ 
          marginTop: '20px',
          padding: '12px 24px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        시작하기 🚀
      </button>

      {/* 스크롤 이동 대상 */}
      <div 
        ref={startRef} 
        style={{ 
          marginTop: '100vh', 
          padding: '60px 20px',
          background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>🎉 뿅!톡을 시작해볼까요?</h2>

        <div style={{ 
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* 카드 1 */}
          <div className="card" style={cardStyle}>
            <h3>💌 사랑 고백</h3>
            <p>마음을 전하는 순간을 특별하게 만들어봐요.</p>
          </div>

          {/* 카드 2 */}
          <div className="card" style={cardStyle}>
            <h3>🎊 축하 메시지</h3>
            <p>기쁨의 순간을 함께 나눠요.</p>
          </div>

          {/* 카드 3 */}
          <div className="card" style={cardStyle}>
            <h3>🧸 추억 만들기</h3>
            <p>소중한 순간을 따뜻하게 간직해요.</p>
          </div>
        </div>
      </div>

      {/* 카드 애니메이션용 추가 스타일 */}
      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          transform: translateY(-8px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

// 카드 스타일
const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '250px',
  textAlign: 'center',
  transition: 'all 0.3s ease'
};

export default App;
