// src/pages/LoveFormPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoveFormPage.css";

const LoveFormPage = () => {
  const navigate = useNavigate();

  return (
    <div className="love-form-wrapper">
      <h1 className="love-form-title">💌 사랑 고백 메시지를 작성해 주세요</h1>
      <p className="love-form-subtext">마음속 사랑을 살며시 남겨보세요</p>
      <textarea
        className="love-form-textarea"
        placeholder="예: 너를 처음 만난 그날부터 내 마음은 너에게..."
        rows={6}
      />
      <button className="back-button" onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default LoveFormPage;
