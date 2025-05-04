import React, { useEffect, useState } from "react";
import "./GeneratePage.css";

const GeneratePage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedMessage = localStorage.getItem("loveMessage");
    if (storedMessage) {
      setMessage(storedMessage);
    }
  }, []);

  return (
    <div className="preview-container">
      <img className="background-image" src="/backgrounds/love-bg1.jpg" alt="배경" />
      <audio autoPlay loop src="/audio/love-theme.mp3" />
      <div className="animated-message">
        {message.split("\n").map((line, index) => (
          <p key={index} className="animated-line">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default GeneratePage;
