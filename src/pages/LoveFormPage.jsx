import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const GeneratePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // location.state에서 데이터 안전하게 구조분해
  const {
    message,
    emotion,
    customImage,
    customAudio,
    theme
  } = location.state || {};

  // 필수 데이터 없으면 홈으로 리다이렉트
  if (!message || !emotion) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    // 2초 후 자동 이동
    const timer = setTimeout(() => {
      navigate('/love/preview', {
        state: {
          message,
          emotion,
          customImage,
          customAudio,
          theme
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, message, emotion, customImage, customAudio, theme]);

  return (
    <div className="preview-container">
      <h2>💌 사랑 메시지를 준비 중입니다...</h2>
    </div>
  );
};

export default GeneratePage;
