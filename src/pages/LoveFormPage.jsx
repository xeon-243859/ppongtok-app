import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoveFormPage.css";

function LoveFormPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [typedText, setTypedText] = useState("");
  const fullText = "마음속 사랑을 살며시 남겨보세요";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [index]);

  const handleNext = () => {
    navigate("/love/style", { state: { message } });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{typedText}</h2>
      <textarea
        className="form-textarea"
        placeholder="고백 메시지를 입력하세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="form-buttons">
        <button className="form-button back" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
        <button className="form-button next" onClick={handleNext}>
          다음으로
        </button>
      </div>
    </div>
  );
}

export default LoveFormPage;
