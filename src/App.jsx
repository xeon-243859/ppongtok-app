// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import LoveFormPage from "./pages/LoveFormPage";
import StyleSelectPage from "./pages/StyleSelectPage";
import ImageSelectPage from "./pages/ImageSelectPage";
import VideoSelectPage from "./pages/VideoSelectPage";
import LovePreviewPage from "./pages/LovePreviewPage";
import ShareCompletePage from "./pages/ShareCompletePage";
import CompletePage from "./pages/CompletePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/love/form" element={<LoveFormPage />} />
        <Route path="/love/style" element={<StyleSelectPage />} />
        <Route path="/image/select" element={<ImageSelectPage />} />
        <Route path="/video/select" element={<VideoSelectPage />} />
        <Route path="/preview" element={<LovePreviewPage />} />
        <Route path="/complete" element={<ShareCompletePage />} />
        <Route path="/complete" element={<CompletePage />} />

      </Routes>
    </Router>
  );
};

export default App;
