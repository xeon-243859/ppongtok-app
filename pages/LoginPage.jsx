import { useAuth } from "../src/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../src/firebase";

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(); // AuthContext의 popup 로그인 함수
    } catch (err) {
      console.error("❌ 로그인 요청 실패:", err);
    }
  };

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

        const redirectTo = localStorage.getItem("afterLoginRedirect");
        if (redirectTo) {
          router.push(redirectTo);
          localStorage.removeItem("afterLoginRedirect");
        } else {
          router.push("/");
        }
      }
    };

    checkAndSaveUser();
  }, [currentUser, router]);

  return (
    <div>
      <h2>로그인하고 시작하세요</h2>
      <button onClick={handleLogin}>구글로 로그인</button>
    </div>
  );
}
