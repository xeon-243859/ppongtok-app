// ✅ App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import LoveFormPage from "./pages/LoveFormPage";
import ImageThemePage from "./pages/ImageThemePage";
import VideoEntryPage from "./pages/VideoEntryPage";
import VideoSelectPage from "./pages/VideoSelectPage";
import MusicSelectPage from "./pages/MusicSelectPage";
import StyleSelectPage from "./pages/StyleSelectPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 앱 시작 시 시작화면으로 */}
        <Route path="/" element={<Navigate to="/intro" replace />} />

        {/* 1단계: 시작화면 */}
        <Route path="/intro" element={<IntroPage />} />

        {/* 2단계: 메시지 입력 */}
        <Route path="/love/form" element={<LoveFormPage />} />

        {/* 3단계: 이미지 or 영상 선택 경로 선택 */}
        <Route path="/style/select" element={<StyleSelectPage />} />
        <Route path="/image/theme" element={<ImageThemePage />} />
        <Route path="/video/entry" element={<VideoEntryPage />} />

        {/* 이후 음악 선택 */}
        <Route path="/video/select" element={<VideoSelectPage />} />
        <Route path="/music/select" element={<MusicSelectPage />} />
      </Routes>
    </Router>
  );
}

export default App;