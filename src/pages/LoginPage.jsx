import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
    }
  };

  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          const user = result.user;
          console.log("✅ 로그인된 유저:", user.email);

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
            console.log("🎉 유저 정보 저장 완료!");
          } else {
            console.log("✅ 기존 유저 로그인!");
          }

          navigate("/");
        } else {
          // 🔎 auth에 이미 로그인된 유저가 있으면 처리
          if (auth.currentUser) {
            console.log("🔄 이미 로그인 상태:", auth.currentUser.email);
            navigate("/");
          } else {
            console.log("❓ 리디렉션 결과에 유저 없음 + 로그인 상태 아님");
          }
        }
      } catch (err) {
        console.error("🔴 getRedirectResult 실패:", err);
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
