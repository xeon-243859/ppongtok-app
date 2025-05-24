import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div>
      <h2>로그인하고 시작하세요</h2>
      <button onClick={login}>구글로 로그인</button>
    </div>
  );
};

export default LoginPage;
