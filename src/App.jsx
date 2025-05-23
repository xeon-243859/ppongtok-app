import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";  // ✅ 새로 추가

import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext"; 
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
import Header from "./components/Header";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </AuthProvider>

   
  
      <Header /> 
    <Routes>
      {/* 🔹 기본 진입 화면 */}
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />

       {/* ✅ 로그인한 사람만 접근 가능하게 보호된 페이지들 */}
        <Route
          path="/write/message"
          element={
            <ProtectedRoute>
              <WriteMessagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview"
          element={
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/share"
          element={
            <ProtectedRoute>
              <SharePage />
            </ProtectedRoute>
          }
        />

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
    </Routes>
      </>
  );
}

export default App;
