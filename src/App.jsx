import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // ✅ 정확히 이렇게
import AppRouter from "./AppRouter";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CategorySelectPage from './pages/CategorySelectPage';
import RedirectToStyle from "./pages/RedirectToStyle";
import IntroPage from "./pages/IntroPage";
import StyleSelectPage from "./pages/StyleSelectPage";
import ImageSelectPage from "./pages/ImageSelectPage";
import ImageThemePage from "./pages/ImageThemePage";
import VideoThemePage from "./pages/VideoThemePage";
import VideoSelectPage from "./pages/VideoSelectPage";
import WriteMessagePage from "./pages/WriteMessagePage";
import MusicSelectPage from "./pages/MusicSelectPage";
import MusicThemePage from "./pages/MusicThemePage";
import LoveFormPage from "./pages/LoveFormPage";
import PreviewPage from "./pages/PreviewPage";
import SharePage from "./pages/SharePage";
import PrepareVideo from "./pages/PrepareVideo";
import PrepareStyle from "./pages/PrepareStyle";
import PaymentPage from "./pages/PaymentPage";
import ViewMessagePage from "./pages/ViewMessagePage";
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
      <Route path="/view-message" element={<ViewMessagePage />} />
    </Routes>
    </AuthProvider>
      );
}

export default App;


