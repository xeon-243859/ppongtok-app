// 2025-04-28 수정 by 보리
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MessagePage from './pages/MessagePage';
import LoveConfessionPage from './pages/LoveConfessionPage';
import CelebrationPage from './pages/CelebrationPage';
import ApologyPage from './pages/ApologyPage';
import ThankYouPage from './pages/ThankYouPage';
import MemoryMakingPage from './pages/MemoryMakingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 처음 "/" 경로는 HomePage로 */}
        <Route path="/" element={<HomePage />} />
        
        {/* 뿅! 효과로 이동할 메시지 선택 페이지 */}
        <Route path="/messages" element={<MessagePage />} />
        
        {/* 메시지별 세부 페이지 */}
        <Route path="/love" element={<LoveConfessionPage />} />
        <Route path="/celebration" element={<CelebrationPage />} />
        <Route path="/apology" element={<ApologyPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/memory" element={<MemoryMakingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
