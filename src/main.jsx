import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import IntroPage from './IntroPage';
import EmotionPage from './EmotionPage';
import MessagePage from './MessagePage';
import VideoPage from './VideoPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/emotion" element={<EmotionPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/video" element={<VideoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
