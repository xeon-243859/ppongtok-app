import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LovePreviewPage from "./pages/LovePreviewPage";
import TestAudioPage from "./pages/TestAudioPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>뿅!톡 메인 페이지</h1>
            <ul>
              <li><a href="/love/preview">사랑 고백 템플릿</a></li>
              <li><a href="/test-audio">🎵 음악 테스트 페이지</a></li>
            </ul>
          </div>
        } />
        <Route path="/love/preview" element={<LovePreviewPage />} />
        <Route path="/test-audio" element={<TestAudioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
