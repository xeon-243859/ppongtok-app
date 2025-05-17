import React from "react";
import { Routes, Route } from "react-router-dom";

import RedirectToStyle from "./pages/RedirectToStyle";
import IntroPage from "./pages/IntroPage";
import StyleSelectPage from "./pages/StyleSelectPage";
import ImageSelectPage from "./pages/ImageSelectPage";
import ImageThemePage from "./pages/ImageThemePage";       // ✅ 우리가 수정한 진짜 저장소
import VideoThemePage from "./pages/VideoThemePage";
import VideoSelectPage from "./pages/VideoSelectPage";

import MusicSelectPage from "./pages/MusicSelectPage";
import MusicThemePage from "./pages/MusicThemePage";
import LoveFormPage from "./pages/LoveFormPage";           // ✅ 고백 메시지 입력 화면
import PreviewPage from "./pages/PreviewPage";             // ✅ 최종 미리보기 화면
import SharePage from "./pages/SharePage";
import PrepareVideo from "./pages/PrepareVideo";
import PrepareStyle from "./pages/PrepareStyle";

// ❌ 더 이상 사용하지 않음 (사용 중단됨)
// import ImageThemeSlotPage from "./pages/ImageThemeSlotPage";

function App() {
  return (
    <Routes>
      {/* 🔹 기본 진입 화면 */}
      <Route path="/" element={<IntroPage />} />
      <Route path="/intro" element={<IntroPage />} />

      {/* 🔹 메시지 입력 화면 */}
      <Route path="/love/form" element={<LoveFormPage />} />

      {/* 🔹 배경 스타일 선택 화면 */}
      <Route path="/style/select" element={<StyleSelectPage />} />
      <Route path="/image/select" element={<ImageSelectPage />} />
      <Route path="/image/theme" element={<ImageThemePage />} />   {/* ✅ 여기에 연결됨 */}
      <Route path="/video/theme" element={<VideoThemePage />} />
      <Route path="/video/select" element={<VideoSelectPage />} />

      {/* 🔹 음악 선택 화면 */}
      <Route path="/music/select" element={<MusicSelectPage />} />
      <Route path="/music/theme" element={<MusicThemePage />} />
      <Route path="/music" element={<MusicSelectPage />} />
      <Route path="/image" element={<ImageSelectPage />} />
      <Route path="/video" element={<VideoSelectPage />} />
      <Route path="/redirect-style" element={<RedirectToStyle />} />
      <Route path="/prepare-video" element={<PrepareVideo />} />
      <Route path="/prepare-style" element={<PrepareStyle />} />
      
      {/* 🔹 미리보기 화면 */}
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="/share" element={<SharePage />} />
    </Routes>
  );
}

export default App;
