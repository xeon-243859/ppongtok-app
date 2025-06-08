import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";

const emotionBackgrounds = {
  love: "bg1.png",
  sorry: "bg2.png",
  cheer: "bg3.png",
  congrats: "bg4.png",
  memory: "bg4.png",
};

const emotionStyle = {
  love: { color: "#ff6b81" },
  sorry: { color: "#6c757d" },
  cheer: { color: "#20c997" },
  congrats: { color: "#f9ca24" },
  memory: { color: "#7f8fa6" },
};

export default function VideoPage() {
  const router = useRouter();
  const { emotion, message } = router.query; // ✅ location.state 대신 query 사용

  const themes = {
    love: {
      background: "bg-love.png",
      music: "bgm-love.mp3",
      color: "#ff8fa3",
      fontFamily: '"Gamja Flower", cursive',
    },
    sad: {
      background: "bg-sad.png",
      music: "bgm-sad.mp3",
      color: "#aaaaaa",
      fontFamily: '"Nanum Gothic", sans-serif',
    },
    happy: {
      background: "bg-happy.png",
      music: "bgm-happy.mp3",
      color: "#fce205",
      fontFamily: '"Do Hyeon", sans-serif',
    },
    memory: {
      background: "bg-memory.png",
      music: "bgm-memory.mp3",
      color: "#a0c4ff",
      fontFamily: '"Noto Serif KR", serif',
    },
  };

  const theme = themes[emotion] || themes.love;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.getElementById("capture-area");
    if (!element) return;

    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "ppongtok-message.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div id="capture-area" style={{ backgroundColor: theme.color, fontFamily: theme.fontFamily }}>
      <h1 style={emotionStyle[emotion]}>🎬 {emotion} 영상 메시지</h1>
      <p>{message}</p>
      <div>
        <button onClick={handleCopy}>{copied ? "링크 복사됨!" : "링크 복사"}</button>
        <button onClick={handleDownload}>이미지 저장</button>
      </div>
    </div>
  );
}
