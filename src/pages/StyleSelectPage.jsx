import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSelectPage.css";

const StyleSelectPage = () => {
  const navigate = useNavigate();

  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 300);
    const timer2 = setTimeout(() => setShowLine2(true), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleImageSelect = () => {
    navigate("/image/select");
  };

  const handleVideoSelect = () => {
    navigate("/video/select");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="style-container">
      <button className="back-button" onClick={handleBack}>← 뒤로가기</button>

      {showLine1 && <h1 className="style-title top-line">어떤 배경으로</h1>}
      {showLine2 && <h1 className="style-title bottom-line">사랑을 담아볼까요?</h1>}

      <div className="style-buttons-vertical">
        <button className="style-button" onClick={handleImageSelect}>
          이미지 배경 선택
        </button>
        <button className="style-button" onClick={handleVideoSelect}>
          영상 배경 선택
        </button>
      </div>
    </div>
  );
};

export default StyleSelectPage;
