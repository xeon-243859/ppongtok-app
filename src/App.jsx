import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import LoveFormPage from './pages/LoveFormPage';
import StyleSelectPage from './pages/StyleSelectPage';
import GeneratePage from './pages/GeneratePage';
import JoinPage from './pages/JoinPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/love/form" element={<LoveFormPage />} />
        <Route path="/style/select" element={<StyleSelectPage />} />
        <Route path="/love/generate" element={<GeneratePage />} />
        <Route path="/love/join" element={<JoinPage />} />
      </Routes>
    </Router>
  );
}

export default App;
