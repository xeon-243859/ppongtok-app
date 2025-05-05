import React, { useState } from 'react';
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
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/love/form" element={<LoveFormPage message={message} setMessage={setMessage} />} />
        <Route path="/love/style" element={<StyleSelectPage />} />
        <Route path="/love/image" element={<ImageBackgroundPage setSelectedImage={setSelectedImage} />} />
        <Route path="/love/video" element={<VideoBackgroundPage setSelectedVideo={setSelectedVideo} />} />
        <Route path="/love/music" element={<MusicSelectPage setSelectedMusic={setSelectedMusic} />} />
        <Route path="/love/generate" element={
          <GeneratePage
            message={message}
            selectedImage={selectedImage}
            selectedVideo={selectedVideo}
            selectedMusic={selectedMusic}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
