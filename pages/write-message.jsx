import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/write-message.module.css"; 


export default function WriteMessagePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleNext = () => {
    // 다음 페이지로 message 전달 등 추가 로직
    router.push("/select-image");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.7rem", marginBottom: "1rem" }}>
        깊은 속마음을 살며시 남겨보세요
      </h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="이곳에 진심을 담은 메시지를 적어보세요"
        rows={8}
        style={{
          width: "100%",
          padding: "1rem",
          fontSize: "1.1rem",
          borderRadius: "12px",
          border: "1px solid #ccc",
          resize: "none",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.05)",
        }}
      />

      <div style={{ textAlign: "right", marginTop: "1rem" }}>
        <button
          onClick={handleNext}
          style={{
            backgroundColor: "#ff7b9c",
            color: "white",
            border: "none",
            padding: "0.7rem 1.5rem",
            borderRadius: "999px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(255, 123, 156, 0.3)",
          }}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
