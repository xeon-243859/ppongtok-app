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
        {/* 메인 시작화면 */}
        <Route path="/" element={<HomePage />} />

        {/* 시작 후 메시지 선택 화면 */}
        <Route path="/message" element={<MessagePage />} />

        {/* 메시지 종류별 페이지 */}
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
