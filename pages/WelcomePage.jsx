// src/pages/WelcomePage.jsx
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/intro");
  };

  return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "'Nanum Pen Script', cursive" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🎉 뿅!톡에 오신 것을 환영합니다!</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        마음을 전하는 사랑 메시지를 만들어보세요 💌
      </p>
      <button
        onClick={handleStart}
        style={{
          fontSize: "1.2rem",
          padding: "1rem 2.5rem",
          borderRadius: "12px",
          backgroundColor: "#ff69b4",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        시작하기
      </button>
    </div>
  );
}
