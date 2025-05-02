// src/hooks/useMetaMask.jsx
import { useState, useEffect, createContext, useContext } from "react";

// MetaMask 전역 상태를 관리하는 Context 생성
const MetaMaskContext = createContext();

// Provider 컴포넌트 정의
export const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  // ✅ 지갑 연결 함수 (디버깅 로그 포함)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("💡 받은 accounts:", accounts); // 디버깅 로그

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("✅ 연결 성공:", accounts[0]);
        } else {
          alert("❌ 연결된 지갑이 없습니다. MetaMask에서 계정을 선택해 주세요.");
        }
      } catch (error) {
        console.warn("❌ 사용자 연결 취소 또는 에러:", error);
      }
    } else {
      alert("🦊 메타마스크가 설치되어 있지 않습니다!");
    }
  };

  // ✅ 계정 변경 감지
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("🔄 accountsChanged 발생:", accounts);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <MetaMaskContext.Provider value={{ account, connectWallet }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

// ✅ Context 사용을 위한 커스텀 훅
export const useMetaMask = () => useContext(MetaMaskContext);
