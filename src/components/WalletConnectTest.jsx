import { useMetaMask } from "../hooks/useMetaMask";

export default function WalletConnectTest() {
  const { account, connectWallet } = useMetaMask();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🦊 메타마스크 연결 테스트</h2>
      {account ? (
        <>
          <p>✅ 연결된 지갑 주소:</p>
          <code style={{ backgroundColor: "#eee", padding: "0.5rem", borderRadius: "6px" }}>
            {account}
          </code>
        </>
      ) : (
        <button
          onClick={connectWallet}
          style={{
            padding: "0.8rem 1.5rem",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#f6851b",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          지갑 연결하기
        </button>
      )}
    </div>
  );
}
