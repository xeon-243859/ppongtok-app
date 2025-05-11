import React from "react";
import { Routes, Route } from "react-router-dom";

import IntroPage from "./pages/IntroPage";
import StyleSelectPage from "./pages/StyleSelectPage";
import ImageSelectPage from "./pages/ImageSelectPage";
import ImageThemePage from "./pages/ImageThemePage";
import VideoThemePage from "./pages/VideoThemePage";
import VideoSelectPage from "./pages/VideoSelectPage";
import MusicSelectPage from "./pages/MusicSelectPage";
import MusicThemePage from "./pages/MusicThemePage";
import LoveFormPage from "./pages/LoveFormPage";       // ✅ 이 줄 꼭 필요!
import PreviewPage from "./pages/PreviewPage";         // ✅ 우리가 만든 진짜 프리뷰
// 이전 프리뷰들은 연결 X (필요 시 아래처럼 다른 경로로 변경 가능)
// import LovePreviewPage from "./pages/LovePreviewPage";
// import EPreviewPage from "./pages/EPreviewPage";


function App() {
  return (
    <Routes>
      {/* 🔹 기본 진입 화면 - 브라우저에서 "/" 입력하면 바로 인트로 페이지로 */}
      <Route path="/" element={<IntroPage />} />

      {/* 🔹 선택적으로 /intro도 작동 가능 */}
      <Route path="/intro" element={<IntroPage />} />

      {/* 🔹 메시지 입력 화면 */}
      <Route path="/love/form" element={<LoveFormPage />} />

      {/* 🔹 배경 스타일 선택 화면 */}
      <Route path="/style/select" element={<StyleSelectPage />} />
      <Route path="/image/select" element={<ImageSelectPage />} />
      <Route path="/image/theme" element={<ImageThemePage />} />
      <Route path="/video/theme" element={<VideoThemePage />} />
      <Route path="/video/select" element={<VideoSelectPage />} />
      <Route path="/music/select" element={<MusicSelectPage />} />
      <Route path="/music/theme" element={<MusicThemePage />} />

      {/* 🔹 미리보기 화면 */}
      <Route path="/preview" element={<PreviewPage />} />
    
    </Routes>
  );
}

export default App;
