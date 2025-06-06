// src/pages/WriteMessagePage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteMessagePage.css"; // CSS 따로 적용

const categoryId = localStorage.getItem("selectedCategory");

const categoryMap = {
  memory: "추억 만들기",
  confess: "사랑 고백",
  celebrate: "축하하기",
  apology: "사과하기",
  thanks: "감사하기"
};

const categoryLabel = categoryMap[categoryId] || "카테고리 없음";

const WriteMessagePage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("message", message);
    navigate("/style/select");
  };

  return (
    <div className="write-message-container">
      <h2>깊은 속마음을 살며시 남겨보세요</h2>
   
    

      <textarea
        className="message-input"
        placeholder="시작하기 - 메시지입력 - 이미지 or 영상선택 - 음원선택 - 완성 "
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
      />

      <button
      className="next-button"
      style={{
        width: "33vw",
        maxWidth: "33vw",
        minWidth: "100px",
        margin: "1.5rem auto",
        display: "block",
        textAlign: "center",
      }}
      onClick={handleNext}
    >

        다음으로
      </button>
    </div>
  );
};

export default WriteMessagePage;
