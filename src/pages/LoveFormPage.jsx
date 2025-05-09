import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoveFormPage.css";

const LoveFormPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleNext = () => {
    if (!message.trim()) {
      alert("메시지를 입력해주세요.");
      return;
    }

    localStorage.setItem("loveMessage", message);
    navigate("/image/theme"); // 또는 "/video/entry"로 수정 가능
  };

  return (
    <div className="love-form-container">
      <h1 className="form-title">💕 사랑 메시지를 입력해보세요</h1>
      <textarea
        className="message-input"
        placeholder="그 사람에게 전하고 싶은 말을 써보세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="next-button" onClick={handleNext}>
        다음으로
      </button>
    </div>
  );
};

export default LoveFormPage;
