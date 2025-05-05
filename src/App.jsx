import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import LoveFormPage from './pages/LoveFormPage';
import StyleSelectPage from './pages/StyleSelectPage';
import ImageBackgroundPage from './pages/ImageBackgroundPage';
import VideoBackgroundPage from './pages/VideoBackgroundPage';
import MusicSelectPage from './pages/MusicSelectPage';
import GeneratePage from './pages/GeneratePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/love/form" element={<LoveFormPage />} />
        <Route path="/style/select" element={<StyleSelectPage />} />
        <Route path="/love/image" element={<ImageBackgroundPage />} />
        <Route path="/love/video" element={<VideoBackgroundPage />} />
        <Route path="/love/music" element={<MusicSelectPage />} />
        <Route path="/love/generate" element={<GeneratePage />} />
      </Routes>
    </Router>
  );
}

export default App;
