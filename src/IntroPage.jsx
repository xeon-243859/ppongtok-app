// src/pages/IntroPage.jsx
import { useEffect, useState } from "react";
import { useMetaMask } from "../../hooks/useMetaMask";
import { useNavigate } from "react-router-dom";
import ManualWalletInput from "../components/ManualWalletInput";

export default function IntroPage() {
  const { account, connectWallet } = useMetaMask();
  const [manualAddress, setManualAddress] = useState(null);
  const navigate = useNavigate();

  const walletAddress = account || manualAddress;

  useEffect(() => {
    if (walletAddress) {
      navigate("/love/preview");
    }
  }, [walletAddress, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "'Nanum Pen Script', cursive" }}>
      <h1 style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>💘 뿅!톡: 사랑 메시지 시작하기</h1>

      <p style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
        메타마스크 지갑을 연결하거나 지갑 주소를 수동으로 입력해 주세요.
      </p>

      <button
        onClick={connectWallet}
        style={{
          fontSize: "1.1rem",
          padding: "0.8rem 1.6rem",
          backgroundColor: "#f6851b",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "2rem"
        }}
      >
        🦊 메타마스크 지갑 연결
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>또는 👇</h3>
        <ManualWalletInput onSubmit={(addr) => setManualAddress(addr)} />
      </div>
    </div>
  );
}
