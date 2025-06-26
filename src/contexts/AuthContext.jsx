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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase"; // firebase.js에서 db도 export 해야 합니다.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase Auth 사용자 정보 (currentUser -> user)
  const [dbUser, setDbUser] = useState(null); // Firestore DB 사용자 정보 (추가됨)
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  // 앱 시작 시 로그인 유지 설정 (한 번만 실행)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => console.error("로그인 유지 설정 실패:", error));
  }, [auth]);

  // 🔍 로그인 상태 변경을 감지하고, Firestore DB 정보와 연동
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log("📌 Auth State Changed:", authUser ? authUser.uid : "로그아웃 상태");

      if (authUser) {
        // --- 1. 사용자가 로그인한 경우 ---
        const userRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          // Firestore에 사용자 문서가 이미 있는 경우
          console.log("✅ 기존 유저 DB 정보 로드:", docSnap.data());
          setDbUser(docSnap.data());
        } else {
          // Firestore에 사용자 문서가 없는 신규 사용자인 경우
          console.log("✨ 신규 유저! DB에 기본 문서 생성.");
          const newUserData = {
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            createdAt: new Date(),
            freePassRemaining: 3, // ✨ 신규 가입 시 무료 이용권 3개 지급
          };
          await setDoc(userRef, newUserData);
          setDbUser(newUserData);
        }
        setUser(authUser); // 인증 정보 설정
      } else {
        // --- 2. 사용자가 로그아웃한 경우 ---
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // ✅ 구글 로그인 함수 (이름 변경 및 반환값 수정)
  const googleLogin = async () => {
    console.log("🟡 googleLogin 함수 진입");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider); // 팝업 로그인
      // 로그인 성공 후 onAuthStateChanged가 모든 상태를 처리하므로 여기선 성공 여부만 반환
      return true;
    } catch (error) {
      if (error.code === "auth/popup-blocked") {
        alert("브라우저에서 팝업이 차단되었어요! 팝업 차단 해제 후 다시 시도해주세요.");
      } else if (error.code !== "auth/popup-closed-by-user") {
        // 사용자가 팝업을 그냥 닫은 경우는 제외하고 에러 알림
        alert("로그인 중 오류가 발생했어요. 다시 시도해주세요.");
      }
      console.error("🔴 로그인 실패:", error.code, error.message);
      return false; // 실패 여부 반환
    }
  };

  // 🔒 로그아웃 함수
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("👋 로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 컨텍스트로 제공할 값들
  const value = {
    user, // 인증 정보
    dbUser, // DB 정보
    googleLogin, // 로그인 함수
    logout, // 로그아웃 함수
    loading, // 로딩 상태
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 컨텍스트를 쉽게 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);