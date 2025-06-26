// src/contexts/AuthContext.jsx

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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase Auth 사용자 정보
  const [dbUser, setDbUser] = useState(null); // Firestore DB 사용자 정보
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) =>
      console.error("로그인 유지 설정 실패:", error)
    );
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log("📌 Auth State Changed:", authUser ? authUser.uid : "로그아웃 상태");

      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          console.log("✅ 기존 유저 DB 정보 로드:", docSnap.data());
          setDbUser(docSnap.data());
        } else {
          console.log("✨ 신규 유저! DB에 기본 문서 생성.");
          const newUserData = {
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            createdAt: new Date(),
            freePassRemaining: 3,
          };
          await setDoc(userRef, newUserData);
          setDbUser(newUserData);
        }

        setUser(authUser);
      } else {
        setUser(null);
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // ✅ 로그인 함수 이름을 login으로 바꿔서 제공
  const login = async () => {
    console.log("🟡 login 함수 진입");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      if (error.code === "auth/popup-blocked") {
        alert("브라우저에서 팝업이 차단되었어요! 해제 후 다시 시도해주세요.");
      } else if (error.code !== "auth/popup-closed-by-user") {
        alert("로그인 중 오류가 발생했어요. 다시 시도해주세요.");
      }
      console.error("🔴 로그인 실패:", error.code, error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("👋 로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, currentUser: user, dbUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
