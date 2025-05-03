import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage_TEMP'; // ✅ 이대로!

import LoveFormPage from './pages/LoveFormPage';
import GeneratePage from './pages/GeneratePage';
import LovePreviewPage from './pages/LovePreviewPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/love/form" element={<LoveFormPage />} />
      <Route path="/love/generate" element={<GeneratePage />} />
      <Route path="/love/preview" element={<LovePreviewPage />} />
    </Routes>
  );
};

export default App;
