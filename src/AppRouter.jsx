// src/AppRouter.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";


// 페이지 컴포넌트 불러오기
import WritePage from "./pages/WriteMessagePage";
import LoginPage from "./pages/LoginPage";
import IntroPage from "./pages/IntroPage";
import PreviewPage from "./pages/PreviewPage";

function AppRouter() {
  const { currentUser, loading } = useAuth() || {};

  console.log("🔐 로그인 상태:", currentUser);

  if (loading) return <div>로딩 중입니다...</div>;

  return (
    <Routes>
      {/* 로그인한 사람만 진입 가능 */}
      <Route
        path="/write"
        element={currentUser ? <WritePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/preview"
        element={currentUser ? <PreviewPage /> : <Navigate to="/login" />}
      />

      {/* 로그인 안 한 사람만 login 진입 가능 */}
      <Route
        path="/login"
        element={!currentUser ? <LoginPage /> : <Navigate to="/write" />}
      />

      {/* 기본 진입 경로 */}
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/write" : "/login"} />}
      />

      {/* 소개 페이지 (필요 시 사용) */}
      {/* <Route path="/intro" element={<IntroPage />} /> */}
    </Routes>
  );
}

export default AppRouter;
