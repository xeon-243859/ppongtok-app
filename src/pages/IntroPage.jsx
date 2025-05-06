import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IntroPage.css";

export default function IntroPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const message = "따뜻한 마음을 여기에 담아주세요";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + message[index]);
      index++;
      if (index === message.length) {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const handleStart = () => {
    navigate("/love/form");
  };

  return (
    <div className="container">
      <div className="welcome-message slide-down">
        <h1>🎉 뿅!톡에 오신 것을 환영합니다</h1>
      </div>
      <p className="typing-text">{typedText}</p>
      <button className="start-button" onClick={handleStart}>시작하기</button>
    </div>
  );
}

export default function IntroPage() {
  
}
