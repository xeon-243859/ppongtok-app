import React, { useState } from "react";
import "../styles/LovePreviewPage.css";

const LovePreviewPage = () => {
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  const handleStart = () => {
    if (!text) return;
    setStarted(true);
    setShowAnimation(true);

    const audio = document.querySelector("audio");
    if (audio) {
      audio.play().catch((e) => {
        console.warn("브라우저가 자동 재생을 차단했습니다:", e);
      });
    }
  };

  return (
    <div className="preview-container">
      {/* 🎵 배경음악 */}
      <audio loop>
        <source src="/music/mueon1.mp3" type="audio/mpeg" />
        브라우저가 오디오를 지원하지 않습니다.
      </audio>

      {/* 🌄 배경 이미지 */}
      <img src="/images/lovesky.jpg" alt="배경" className="background-image" />

      {!started ? (
        <div className="input-box">
          <h2>💌 고백할 메시지를 입력하세요</h2>
          <textarea
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="예: 보리야, 너를 만나고 나의 하루가 달라졌어"
          />
          <button onClick={handleStart}>고백 메시지 영상처럼 보기 💖</button>
        </div>
      ) : (
        <div className="animated-text">
          {showAnimation &&
            [...text].map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                {char}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default LovePreviewPage;
