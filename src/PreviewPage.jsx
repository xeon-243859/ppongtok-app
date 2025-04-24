import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { emotion, category, message } = location.state || {};

  // 전달받은 값 확인
  useEffect(() => {
    console.log("🧩 감정:", emotion);
    console.log("🧩 카테고리:", category);
    console.log("🧩 메시지:", message);

    if (!emotion || !category || !message) {
      alert("정보가 누락되어 처음으로 돌아갑니다.");
      navigate("/");
    }
  }, [emotion, category, message, navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f5f5ff",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>🎥 메시지 미리보기</h1>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center"
      }}>
        <p><strong>감정:</strong> {emotion}</p>
        <p><strong>카테고리:</strong> {category}</p>
        <p style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>{message}</p>
      </div>
      <button
        onClick={() => navigate("/video", { state: { emotion, category, message } })}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          backgroundColor: "#7c3aed",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        👉 영상으로 완성하기
      </button>
    </div>
  );
};

export default PreviewPage;
