import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../src/contexts/AuthContext"; // ✅ 정확한 상대경로

import Header from "../src/components/Header";                  // ✅ 대소문자 정확히
import LoginPage from "./LoginPage";                       // ✅ 한글 아님
import ProtectedRoute from "../src/components/ProtectedRoute"; // ✅ 경로 상위로 이동

import CategorySelectPage from "./CategorySelectPage";
import RedirectToStyle from "./RedirectToStyle";
import IntroPage from "./IntroPage";
import StyleSelectPage from "./StyleSelectPage";
import ImageSelectPage from "./ImageSelectPage";
import ImageThemePage from "./ImageThemePage";
import VideoThemePage from "./VideoThemePage";
import VideoSelectPage from "./VideoSelectPage";
import WriteMessagePage from "./WriteMessagePage";
import MusicSelectPage from "./MusicSelectPage";
import MusicThemePage from "./MusicThemePage";
import LoveFormPage from "./LoveFormPage";
import PreviewPage from "./PreviewPage";
import SharePage from "./SharePage";
import PrepareVideo from "./PrepareVideo";
import PrepareStyle from "./PrepareStyle";
import PaymentPage from "./PaymentPage";
import ViewMessagePage from "./ViewMessagePage";

console.log("🧩 App 컴포넌트 렌더링됨");

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 🔹 기본 진입 화면 */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔹 메시지 입력 화면 */}
        <Route path="/love/form" element={<LoveFormPage />} />
        <Route path="/write/message" element={<WriteMessagePage />} />

        {/* 🔹 배경 스타일 선택 화면 */}
        <Route path="/style/select" element={<StyleSelectPage />} />
        <Route path="/image/select" element={<ImageSelectPage />} />
        <Route path="/image/theme" element={<ImageThemePage />} />
        <Route path="/video/theme" element={<VideoThemePage />} />
        <Route path="/video/select" element={<VideoSelectPage />} />

        {/* 🔹 음악 선택 화면 */}
        <Route path="/music/select" element={<MusicSelectPage />} />
        <Route path="/music/theme" element={<MusicThemePage />} />

        {/* 🔹 리디렉션 및 기타 */}
        <Route path="/music" element={<MusicSelectPage />} />
        <Route path="/image" element={<ImageSelectPage />} />
        <Route path="/video" element={<VideoSelectPage />} />
        <Route path="/redirect-style" element={<RedirectToStyle />} />
        <Route path="/prepare-video" element={<PrepareVideo />} />
        <Route path="/prepare-style" element={<PrepareStyle />} />
        <Route path="/select-category" element={<CategorySelectPage />} />

        {/* 🔹 미리보기 및 공유 */}
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/view/:id" element={<ViewMessagePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
