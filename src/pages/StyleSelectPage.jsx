import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSelectPage.css";

function StyleSelectPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "어떤 배경으로 사랑을 담아볼까요?";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typing = setTimeout(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }
    }, 100);
    return () => clearTimeout(typing);
  }, [index]);

  return (
    <div className="style-container">
      <h2 className="style-title">{typedText}</h2>
      <div className="style-buttons">
        <button
          className="style-button"
          onClick={() => navigate("/image/select")}
        >
          이미지 배경 선택
        </button>
        <button
          className="style-button"
          onClick={() => navigate("/video/select")}
        >
          영상 배경 선택
        </button>
      </div>
    </div>
  );
}

export default StyleSelectPage;
