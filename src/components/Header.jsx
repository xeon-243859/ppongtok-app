import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext"; // ✅ 경로와 이름 확인

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth() || {}; // ✅ null-safe 구조분해

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header
      style={{
        backgroundColor: "#f8f9fa",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>뿅!톡</h1>
      </div>
      <div>
        {currentUser && (
          <>
            <span style={{ marginRight: "10px" }}>
              {currentUser.displayName}님, 안녕하세요!
            </span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
