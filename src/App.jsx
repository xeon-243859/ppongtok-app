// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import IntroPage from "./IntroPage";
import HomePage from "./pages/HomePage";
import LovePreviewPage from "./pages/LovePreviewPage";
import MessagePage from "./pages/MessagePage";
import WelcomePage from "./pages/WelcomePage";
import EmotionPage from "./pages/EmotionPage";
import LoveConfessionPage from "./pages/LoveConfessionPage";
import LoveWritePage from "./pages/LoveWritePage";
import LoveFinalPage from "./pages/LoveFinalPage";
import TestAudioPage from "./pages/TestAudioPage";

import "./styles/LovePreviewPage.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/love/preview" element={<LovePreviewPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/emotion" element={<EmotionPage />} />
        <Route path="/love/write" element={<LoveWritePage />} />
        <Route path="/love/confess" element={<LoveConfessionPage />} />
        <Route path="/love/final" element={<LoveFinalPage />} />
        <Route path="/test-audio" element={<TestAudioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
