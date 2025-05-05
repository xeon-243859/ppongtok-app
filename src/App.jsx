import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import LoveFormPage from "./pages/LoveFormPage";
import StyleSelectPage from "./pages/StyleSelectPage";
import ImageSelectPage from "./pages/ImageSelectPage"; // ✅ 추가
import VideoSelectPage from "./pages/VideoSelectPage"; // ✅ 추가
import GeneratePage from "./pages/GeneratePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/love" element={<LoveFormPage />} />
        <Route path="/style" element={<StyleSelectPage />} />
        <Route path="/select/image" element={<ImageSelectPage />} /> {/* ✅ */}
        <Route path="/select/video" element={<VideoSelectPage />} /> {/* ✅ */}
        <Route path="/generate" element={<GeneratePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
