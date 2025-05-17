// src/pages/WriteMessagePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <textarea
        placeholder="시작하기 - 메시지입력 - 이미지 or 영상선택 - 음원선택 - 완성"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
      />
      <button onClick={handleNext}>다음으로</button>
    </div>
  );
};

export default WriteMessagePage;
