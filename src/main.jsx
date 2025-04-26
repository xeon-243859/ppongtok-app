import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import IntroPage from './IntroPage';
import EmotionPage from './EmotionPage';
import MessagePage from './MessagePage';
import PreviewPage from './PreviewPage';
import VideoPage from './VideoPage';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/emotion" element={<EmotionPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/preview" element={<PreviewPage />} /> {/* ✅ 이거 추가 */}
        <Route path="/video" element={<VideoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
;


