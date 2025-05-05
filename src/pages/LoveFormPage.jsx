// src/pages/LoveFormPage.jsx
import React from "react";

const LoveFormPage = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>💌 사랑 고백 메시지를 작성해 주세요</h1>
      <p>당신의 진심을 담은 메시지를 입력해보세요!</p>
      <textarea
        rows={6}
        cols={40}
        placeholder="예: 너를 처음 만난 그날부터 내 마음은 너에게..."
        style={{
          marginTop: "20px",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "none",
        }}
      />
    </div>
  );
};

export default LoveFormPage;
