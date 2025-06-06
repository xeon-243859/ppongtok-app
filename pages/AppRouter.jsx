import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../src/contexts/AuthContext";

import WriteMessagePage from "./WriteMessagePage";
import LoginPage from "./LoginPage";
import IntroPage from "./IntroPage";
import PreviewPage from "./PreviewPage";
import SharePage from "./SharePage";
import PaymentPage from "./PaymentPage";

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
      path="/payment"
      element={currentUser ? <PaymentPage /> : <Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={!currentUser ? <LoginPage /> : <Navigate to="/write" />}
      />
      <Route path="/view/:id" element={<ViewMessagePage />} />

    </Routes>
  );
}

export default AppRouter;
