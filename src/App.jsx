import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import LoveFormPage from './pages/LoveFormPage';
import StyleSelectPage from './pages/StyleSelectPage';
import ImageSelectPage from './pages/ImageSelectPage';
import ImageThemePage from './pages/ImageThemePage'; // ✅ 새로 import
import MusicSelectPage from './pages/MusicSelectPage';
import LovePreviewPage from './pages/LovePreviewPage';
import VideoSelectPage from "./pages/VideoSelectPage";
import VideoThemePage from "./pages/VideoThemePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/love/form" element={<LoveFormPage />} />
        <Route path="/love/style" element={<StyleSelectPage />} />
        <Route path="/image/select" element={<ImageSelectPage />} />
        <Route path="/image/theme" element={<ImageThemePage />} /> {/* ✅ 추가 */}
        <Route path="/music/select" element={<MusicSelectPage />} />
        <Route path="/love/preview" element={<LovePreviewPage />} />
        <Route path="/video/select" element={<VideoSelectPage />} />
        <Route path="/video/theme" element={<VideoThemePage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
