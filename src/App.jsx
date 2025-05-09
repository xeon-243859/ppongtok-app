// ✅ App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import VideoEntryPage from "./pages/VideoEntryPage";
import VideoSelectPage from "./pages/VideoSelectPage";
import VideoUploadPage from "./pages/VideoUploadPage";
import MusicSelectPage from "./pages/MusicSelectPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 앱 시작 시 intro로 리디렉트 */}
        <Route path="/" element={<Navigate to="/intro" />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/video/entry" element={<VideoEntryPage />} />
        <Route path="/video/select" element={<VideoSelectPage />} />
        <Route path="/video/upload" element={<VideoUploadPage />} />
        <Route path="/music/select" element={<MusicSelectPage />} />
      </Routes>
    </Router>
  );
}

export default App;