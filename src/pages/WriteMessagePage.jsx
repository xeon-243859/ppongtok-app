// src/pages/WriteMessagePage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteMessagePage.css"; // CSS 따로 적용

const WriteMessagePage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("message", message);
    navigate("/style/select");
  };

  return (
    <div className="write-message-container">
      <h2>마음속 사랑을 살며시 남겨보세요</h2>

      <p className="progress-bar">
        시작하기 - 메시지입력 - 이미지 or 영상선택 - 음원선택 - 완성
      </p>

      <textarea
        className="message-input"
        placeholder="여기에 마음을 담아 적어주세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
      />

      <button className="next-button" onClick={handleNext}>
        다음으로
      </button>
    </div>
  );
};

export default WriteMessagePage;
