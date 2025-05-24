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


function App() {
 return (
     <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;