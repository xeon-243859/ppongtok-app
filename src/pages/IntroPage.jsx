// src/pages/IntroPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../intropage.css";

function IntroPage() {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState("");
  const fullText = "따뜻한 마음을 여기에 담아주세요";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < fullText.length) {
        setTypingText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [index]);

  const handleStart = () => {
    navigate("/love/form");
  };

  return (
    <div className="intro-container">
      <h1 className="intro-title">🎉 뿅!톡에 오신 것을 환영합니다</h1>
      <p className="intro-typing">{typingText}</p>
      <button className="intro-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
}

export default IntroPage;
