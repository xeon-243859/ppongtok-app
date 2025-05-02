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
            <p>아래 경로로 테스트할 수 있어요:</p>
            <ul>
              <li><a href="/love/preview">/love/preview</a></li>
              <li><a href="/test-audio">/test-audio</a></li>
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
