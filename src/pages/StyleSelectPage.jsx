// src/pages/StyleSelectPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StyleSelectPage.css";

const StyleSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="style-wrapper">
      <h2 className="style-title">원하는 배경 스타일을 선택해주세요</h2>

      <div className="style-buttons">
        <button onClick={() => navigate("/image/select")}>🖼 이미지 배경</button>
        <button onClick={() => navigate("/video/select")}>🎥 영상 배경</button>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>← 뒤로가기</button>
    </div>
  );
};

export default StyleSelectPage;
