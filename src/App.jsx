import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MessagePage from './pages/MessagePage';
import LoveConfessionPage from './pages/LoveConfessionPage';
import CelebrationPage from './pages/CelebrationPage';

// ⬇️ 여기에 새로 추가!
import ApologyPage from './pages/ApologyPage';
import ThankYouPage from './pages/ThankYouPage';
import MemoryPage from './pages/MemoryPage';

// (추가로 기존에 네가 쓰던 관리자페이지 import가 더 있을 수도 있어)
// import AdminPage from './pages/AdminPage'; 이런 것도 있을 거야.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메시지 메인 페이지 */}
        <Route path="/" element={<MessagePage />} />

        {/* 기존 메시지용 페이지들 */}
        <Route path="/love" element={<LoveConfessionPage />} />
        <Route path="/celebration" element={<CelebrationPage />} />

        {/* ⬇️ 새로 추가하는 3개 메시지용 페이지 */}
        <Route path="/apology" element={<ApologyPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/memory" element={<MemoryPage />} />

        {/* (기존에 네가 만들었던 /admin, /votes, /candidates, /preview 이런 관리자 라우트들도 여기에 같이 있음) */}
        {/* 예를 들면: */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        {/* <Route path="/votes" element={<VotesPage />} /> */}
        {/* <Route path="/candidates" element={<CandidatesPage />} /> */}
        {/* 이런 식으로 기존 코드 유지! */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
