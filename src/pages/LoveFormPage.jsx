// src/pages/LoveFormPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoveFormPage.css";

const LoveFormPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const goToNext = () => {
    if (message.trim().length === 0) {
      alert("메시지를 입력해주세요!");
      return;
    }

    // 메시지를 localStorage에 저장
    localStorage.setItem("loveMessage", message);

    // 다음 페이지로 이동
    navigate("/love/style");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="loveform-wrapper">
      <h2 className="title-text">
        마음을 담아 <br />
        고백 메시지를 적어주세요
      </h2>

      <textarea
        placeholder="예) 너를 처음 만난 그날부터..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="message-input"
        rows={6}
      />

      <div className="form-buttons">
        <button onClick={goBack}>뒤로가기</button>
        <button onClick={goToNext}>다음으로</button>
      </div>
    </div>
  );
};

export default LoveFormPage;
