import React, { useEffect, useState } from "react";
import "./GeneratePage.css";

const GeneratePage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const storedMessage = localStorage.getItem("loveMessage");
      if (storedMessage && storedMessage.trim() !== "") {
        setMessage(storedMessage);
      } else {
        setMessage("💌 고백 메시지가 아직 작성되지 않았어요!");
      }
    } catch (error) {
      console.error("localStorage 접근 에러:", error);
      setMessage("⚠️ 메시지를 불러오는 데 문제가 발생했어요.");
    }
  }, []);

  return (
    <div className="preview-container">
      <img
        className="background-image"
        src="/backgrounds/love-bg1.jpg"
        alt="배경 이미지"
      />
      <audio autoPlay loop src="/audio/love-theme.mp3" />
      <div className="animated-message">
        {message &&
          message.split("\n").map((line, index) => (
            <p key={index} className="animated-line">
              {line}
            </p>
          ))}
      </div>
    </div>
  );
};

export default GeneratePage;
