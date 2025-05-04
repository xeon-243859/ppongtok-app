import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoveFormPage.css";

const LoveFormPage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("loveMessage", message);
    navigate("/love/preview");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">당신의 사랑을 적어주세요</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="당신의 마음을 여기 적어주세요..."
          required
        />
        <button className="submit-button" type="submit">
          고백 메시지 완성!
        </button>
      </form>
    </div>
  );
};

export default LoveFormPage;
