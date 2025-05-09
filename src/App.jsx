import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import VideoEntryPage from "./pages/VideoEntryPage";
import VideoSelectPage from "./pages/VideoSelectPage";
import VideoUploadPage from "./pages/VideoUploadPage"; // 만약 만들 예정이라면

function App() {
  return (
    <Router>
      <Routes>
        {/* 시작 시 무조건 entry 페이지로 */}
        <Route path="/" element={<Navigate to="/video/entry" replace />} />
        
        {/* 영상 선택 진입화면 (1단계) */}
        <Route path="/video/entry" element={<VideoEntryPage />} />

        {/* 영상 저장소 선택화면 (썸네일) */}
        <Route path="/video/select" element={<VideoSelectPage />} />

        {/* 내 파일 업로드 선택화면 */}
        <Route path="/video/upload" element={<VideoUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
