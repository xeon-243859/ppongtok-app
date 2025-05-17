import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSelectPage.css";

const StyleSelectPage = () => {
  const navigate = useNavigate();
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 300);
    const timer2 = setTimeout(() => setShowLine2(true), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleImageClick = () => {
    navigate("/image/select");
  };

  const handleVideoClick = () => {
    navigate("/prepare-video"); // ✅ 중간 허브 페이지로 이동
  };

  return (
    <div className="style-select-container">
      {showLine1 && <h2 className="style-title-line1">어떤 배경으로</h2>}
      {showLine2 && <h2 className="style-title-line2">사랑을 담아볼까요?</h2>}

      <div className="style-button-group">
        <button onClick={handleImageClick}>이미지 배경 선택</button>
        <button onClick={handleVideoClick}>영상 배경 선택</button>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>
    </div>
  );
};

export default StyleSelectPage;
