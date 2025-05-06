import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IntroPage.css";

const IntroPage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    setShowWelcome(true);

    const message = "따뜻한 마음을 여기에 담아주세요";
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setTypedText((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // 글자당 100ms 간격

    return () => clearInterval(typingInterval);
  }, []);

  const handleStart = () => {
    navigate("/love/form");
  };

  return (
    <div className="intro-page">
      <h1 className={`welcome-message ${showWelcome ? "slide-down" : ""}`}>
        🎉 뿅!톡에 오신 것을 환영합니다
      </h1>
      <p className="typing-text">{typedText}</p>
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
};

export default IntroPage;
