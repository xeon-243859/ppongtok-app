import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MessagePage from './pages/MessagePage';
import LoveConfessionPage from './pages/LoveConfessionPage';
import CelebrationPage from './pages/CelebrationPage';
import ApologyPage from './pages/ApologyPage';
import ThankYouPage from './pages/ThankYouPage';
import MemoryMakingPage from './pages/MemoryMakingPage';

function App() {
  return (
    <BrowserRouter basename="/ppongtok-app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/love" element={<LoveConfessionPage />} />
        <Route path="/celebration" element={<CelebrationPage />} />
        <Route path="/apology" element={<ApologyPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/memory" element={<MemoryMakingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
