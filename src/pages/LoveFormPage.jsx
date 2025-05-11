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
    navigate("/style/select"); // ✅ 선택화면으로 이동
  };

  return (
    <div className="love-form-container">
      <h2 className="form-title">마음속 사랑을 살며시 남겨보세요</h2>

      <textarea
        className="message-input"
        placeholder="시작하기 - 메시지입력 - 이미지 or 영상선택 - 음원선택 - 완성"
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
