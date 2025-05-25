// src/pages/LoginPage.jsx

import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  // ✅ 로그인 버튼 클릭 시
  const handleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider); // 리디렉션 방식
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
    }
  };

  // ✅ 로그인 리디렉션 결과 처리
  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const user = result.user;
          const userRef = doc(db, "users", user.uid);
          const snapshot = await getDoc(userRef);

          if (!snapshot.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              name: user.displayName || "이름 없음",
              photoURL: user.photoURL || "",
              createdAt: new Date(),
              freePassRemaining: 3,
            });
            console.log("🎉 Firestore에 유저 정보 저장 완료!");
          } else {
            console.log("✅ 기존 사용자입니다.");
          }

          navigate("/");
        }
      } catch (err) {
        console.error("🔴 리디렉션 결과 처리 실패:", err);
      }
    };

    fetchRedirectResult();
  }, [navigate]);

  return (
    <div>
      <h2>로그인하고 시작하세요</h2>
      <button onClick={handleLogin}>구글로 로그인</button>
    </div>
  );
};

export default LoginPage;
