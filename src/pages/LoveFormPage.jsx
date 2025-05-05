// src/pages/LoveFormPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoveFormPage.css";

const LoveFormPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/love/style"); 
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="love-form-wrapper">
      <div className="love-form-container">
        <h2 className="form-title">💌 사랑 고백 메시지를 작성해 주세요</h2>
        <p className="form-sub">마음속 사랑을 살며시 남겨보세요</p>
        <textarea
          className="love-textarea"
          rows={6}
          placeholder="예: 너를 처음 만난 그날부터 내 마음은 너에게..."
        />
        <button className="next-button" onClick={handleNext}>
          다음으로
        </button>
      </div>
      <button className="back-button" onClick={goBack}>뒤로가기</button>
    </div>
  );
};

export default LoveFormPage;
