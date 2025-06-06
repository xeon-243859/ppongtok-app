// src/pages/LoginPage.jsx

import { useAuth } from "../src/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const LoginPage = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // 로그인 버튼 클릭
  const handleLogin = async () => {
    try {
      await login(); // AuthContext의 popup 로그인 함수
    } catch (err) {
      console.error("❌ 로그인 요청 실패:", err);
    }
  };

  // 로그인 후 Firestore 사용자 등록 확인
  useEffect(() => {
    const checkAndSaveUser = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || "이름 없음",
            photoURL: currentUser.photoURL || "",
            createdAt: new Date(),
            freePassRemaining: 3,
          });
          console.log("🎉 Firestore에 새 유저 저장 완료");
        } else {
          console.log("✅ 기존 유저 Firestore 확인됨");
        }

      
          // ✅ 로그인 후 리디렉션 처리
        const redirectTo = localStorage.getItem("afterLoginRedirect");
        if (redirectTo) {
          navigate(redirectTo);
          localStorage.removeItem("afterLoginRedirect");
        } else {
          navigate("/"); // 기본값
        }
      }
    };
    

    checkAndSaveUser();
  }, [currentUser, navigate]);

  return (
    <div>
      <h2>로그인하고 시작하세요</h2>
      <button onClick={handleLogin}>구글로 로그인</button>
    </div>
  );
};

export default LoginPage;
