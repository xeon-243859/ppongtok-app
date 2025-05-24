import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

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
      <Route
        path="/write"
        element={currentUser ? <WritePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/preview"
        element={currentUser ? <PreviewPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={!currentUser ? <LoginPage /> : <Navigate to="/write" />}
      />
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/write" : "/login"} />}
      />
      {/* <Route path="/intro" element={<IntroPage />} /> */}
    </Routes>
  );
}

export default AppRouter;
