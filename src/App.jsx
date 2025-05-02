// src/App.jsx
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";       // 🎉 뿅!톡에 오신 것을 환영합니다
import IntroPage from "./pages/introPage";         // 🦊 지갑 연결 or 수동입력
import LovePreviewPage from "./pages/LovePreviewPage"; // 💌 메시지 템플릿/입력/공유

export default function App() {
  return (
    <Routes>
      {/* 1. 앱 첫 진입 시 환영화면 */}
      <Route path="/" element={<WelcomePage />} />

      {/* 2. 지갑 연결 or 수동입력 페이지 */}
      <Route path="/intro" element={<IntroPage />} />

      {/* 3. 템플릿 선택, 메시지 작성, 공유 등 전체 흐름 */}
      <Route path="/love/preview" element={<LovePreviewPage />} />
    </Routes>
  );
}
