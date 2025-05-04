import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import LoveFormPage from "./pages/LoveFormPage";
import GeneratePage from "./pages/GeneratePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/love/form" element={<LoveFormPage />} />
        <Route path="/love/preview" element={<GeneratePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
