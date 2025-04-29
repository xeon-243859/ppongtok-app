import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MessagePage from './pages/MessagePage';

// 각 메시지별 페이지 (현재는 임시로 간단하게 연결만)
function LoveConfessionPage() {
  return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>❤️ 사랑고백 페이지 ❤️</h2>;
}
function CelebrationPage() {
  return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>🎉 축하하기 페이지 🎉</h2>;
}
function ApologyPage() {
  return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>🙏 사과하기 페이지 🙏</h2>;
}
function ThankYouPage() {
  return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>💌 감사하기 페이지 💌</h2>;
}
function MemoryPage() {
  return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>📸 추억만들기 페이지 📸</h2>;
}

function App() {
  return (
    <BrowserRouter basename="/ppongtok-app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/love" element={<LoveConfessionPage />} />
        <Route path="/celebration" element={<CelebrationPage />} />
        <Route path="/apology" element={<ApologyPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/memory" element={<MemoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
