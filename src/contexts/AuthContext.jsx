// contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { app } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  // 🔍 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("📌 로그인 감지됨:", user);
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);
  console.log("🧩 AuthProvider 작동 시작됨");


  // ✅ 로그인 함수 (popup + 로그인 유지 설정)
 const login = async () => {
  console.log("🟡 login 함수 진입");
  const provider = new GoogleAuthProvider();
  try {
    await setPersistence(auth, browserLocalPersistence); // 로그인 유지
    const result = await signInWithPopup(auth, provider); // 팝업 로그인
    return result.user; // ✅ 로그인한 user 반환
  } catch (error) {
    if (error.code === "auth/popup-blocked") {
      alert("브라우저에서 팝업이 차단되었어요! 팝업 차단 해제 후 다시 시도해주세요.");
    } else if (error.code === "auth/cancelled-popup-request") {
      alert("팝업이 중복 실행되었어요. 창을 닫고 다시 시도해주세요.");
    } else {
      alert("로그인 중 오류가 발생했어요. 다시 시도해주세요.");
    }
    console.error("🔴 로그인 실패:", error.code, error.message, error);
    throw error; // 실패한 경우 상위에서 처리 가능하게 throw
  }
};



  // 🔒 로그아웃 함수
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
