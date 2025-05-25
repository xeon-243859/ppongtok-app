import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import WriteMessagePage from "./pages/WriteMessagePage";
import LoginPage from "./pages/LoginPage";
import IntroPage from "./pages/IntroPage";
import PreviewPage from "./pages/PreviewPage";
import SharePage from "./pages/SharePage";

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AppRouter() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>로딩 중입니다...</div>;

  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />

      <Route
        path="/write"
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

      <Route
        path="/login"
        element={!currentUser ? <LoginPage /> : <Navigate to="/write" />}
      />
    </Routes>
  );
}

export default AppRouter;
