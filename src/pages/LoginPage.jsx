// src/pages/LoginPage.jsx
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
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
          freePassRemaining: 3
        });
        console.log("🎉 Firestore에 유저 정보 저장 완료!");
      } else {
        console.log("✅ 기존 사용자입니다.");
      }

      // 로그인 후 리디렉션 or 상태 저장 (필요시)
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
    }
  };

  return (
    <div>
      <h2>로그인하고 시작하세요</h2>
      <button onClick={handleLogin}>구글로 로그인</button>
    </div>
  );
};

export default LoginPage;
