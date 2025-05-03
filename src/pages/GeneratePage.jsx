// src/pages/GeneratePage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GeneratePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/love/preview', {
        state: location.state
      });
    }, 2000); // 2초 후 이동

    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="generate-page">
      <h2>사랑 메시지를 준비 중입니다... 💗</h2>
    </div>
  );
};

export default GeneratePage;
