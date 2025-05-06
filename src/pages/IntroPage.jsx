import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./intropage.css";

function IntroPage() {
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(false);
  const [typedText, setTypedText] = useState("");

  const fullText = "따뜻한 마음을 여기에 담아주세요";

  useEffect(() => {
    setShowTitle(true);
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const handleStart = () => {
    navigate("/love/form");
  };

  return (
    <div className="intro-page">
      {showTitle && (
        <>
          <h1 className="intro-title">🎉 뿅!톡에 오신 것을 환영합니다</h1>
          <p className="intro-text">{typedText}</p>
        </>
      )}
      <button className="start-button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  );
}

export default IntroPage;
