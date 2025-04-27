import React from 'react';
import { useNavigate } from 'react-router-dom';

function MessagePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f9ff',
        padding: '2rem',
        position: 'relative'
      }}
    >
      {/* 뒤로가기 버튼 추가 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        🔙
      </button>

      <section style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2 style={{ fontSize: '2rem' }}>🎉 뿅!톡을 시작해볼까요?</h2>
        {/* 메시지 카드들은 여기에 계속 */}
      </section>
    </div>
  );
}

export default MessagePage;
