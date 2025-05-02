// src/components/ManualWalletInput.jsx
import { useState, useEffect } from "react";

export default function ManualWalletInput({ onSubmit }) {
  const [manualAddress, setManualAddress] = useState("");
  const [isValid, setIsValid] = useState(null);

  // localStorage에서 주소 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("manualWalletAddress");
    if (saved) {
      setManualAddress(saved);
      const valid = /^0x[a-fA-F0-9]{40}$/.test(saved);
      setIsValid(valid);
      if (valid && onSubmit) onSubmit(saved); // 주소 넘기기
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setManualAddress(value);
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(value);
    setIsValid(isValidAddress);

    if (isValidAddress) {
      localStorage.setItem("manualWalletAddress", value);
      if (onSubmit) onSubmit(value); // 주소 넘기기
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>📝 지갑 주소 수동 입력</h2>
      <input
        type="text"
        value={manualAddress}
        onChange={handleChange}
        placeholder="0x로 시작하는 지갑 주소를 입력하세요"
        style={{
          padding: "0.8rem",
          width: "80%",
          maxWidth: "400px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />
      <div style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        {manualAddress === "" ? null : isValid ? (
          <p style={{ color: "green" }}>✅ 유효한 지갑 주소입니다!</p>
        ) : (
          <p style={{ color: "red" }}>❌ 유효하지 않은 주소입니다.</p>
        )}
      </div>
      {isValid && (
        <div style={{ marginTop: "2rem" }}>
          <p>📬 저장된 지갑 주소:</p>
          <code style={{ background: "#eee", padding: "0.4rem", borderRadius: "6px" }}>
            {manualAddress}
          </code>
        </div>
      )}
    </div>
  );
}
