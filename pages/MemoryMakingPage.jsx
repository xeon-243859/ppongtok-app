import React from "react";

export default function MemoryMakingPage() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f0f7ff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        📸 추억을 만들어볼까요?
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#555" }}>
        특별한 순간을 기억하고 공유하는 소중한 추억을 남겨보세요.
      </p>
      <button
        style={{
          backgroundColor: "#90caf9",
          color: "#fff",
          border: "none",
          borderRadius: "30px",
          padding: "0.8rem 2rem",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#64b5f6")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#90caf9")
        }
      >
        추억 만들기 ✍️
      </button>
    </div>
  );
}
