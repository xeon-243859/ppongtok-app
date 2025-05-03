// src/pages/GeneratePage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GeneratePage.css';

const GeneratePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message, emotion } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/love/preview', {
        state: { message, emotion },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, message, emotion]);

  return (
    <div className="generate-container">
      <h2>사랑 메시지를 준비 중입니다...</h2>
      <p>잠시만 기다려 주세요 💖</p>
    </div>
  );
};

export default GeneratePage;
