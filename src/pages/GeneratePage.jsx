import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneratePage.css';

const GeneratePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/love/preview');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="generate-container">
      <h2>사랑 메시지를 준비 중입니다...</h2>
      <p>잠시만 기다려 주세요 💖</p>
    </div>
  );
};

export default GeneratePage;
