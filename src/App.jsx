import React from "react";
import { Routes, Route } from "react-router-dom";

import IntroPage from "./pages/IntroPage";
import LoveFormPage from "./pages/LoveFormPage";
import StyleSelectPage from "./pages/StyleSelectPage";
import ImageSelectPage from "./pages/ImageSelectPage";
// 필요하면 여기 다른 페이지들도 추가 가능

function App() {
  return (
    <Routes>
      {/* 🔹 기본 진입 화면 - 브라우저에서 "/" 입력하면 바로 인트로 페이지로 */}
      <Route path="/" element={<IntroPage />} />

      {/* 🔹 선택적으로 /intro도 작동 가능 */}
      <Route path="/intro" element={<IntroPage />} />

      {/* 🔹 메시지 입력 화면 */}
      <Route path="/love/form" element={<LoveFormPage />} />

      {/* 🔹 배경 스타일 선택 화면 */}
      <Route path="/style/select" element={<StyleSelectPage />} />
      <Route path="/image/select" element={<ImageSelectPage />} />
    </Routes>
  );
}

export default App;
