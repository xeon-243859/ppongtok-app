import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";

const IntroPage = () => {
  const navigate = useNavigate();
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 500);
    const timer2 = setTimeout(() => setShowLine2(true), 2000);
    const timer3 = setTimeout(() => setShowLine3(true), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleStart = () => {
    navigate("/love");
  };

  return (
    <div className="intro-container">
      {showLine1 && <h1 className="typing-top">뿅!톡에 오신 것을</h1>}
      {showLine2 && <h1 className="typing-side">환영합니다</h1>}
      {showLine3 && <p className="typing-bottom">따뜻한 마음을 여기에 담아주세요</p>}

      {showLine3 && (
        <button className="start-button" onClick={handleStart}>
          시작하기
        </button>
      )}
    </div>
  );
};

export default IntroPage;
