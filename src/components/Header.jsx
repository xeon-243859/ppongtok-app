import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const MyHeader = () => {
  const { currentUser } = useAuth() || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  return (
    <header style={{ padding: "10px", textAlign: "right" }}>
      {user && (
        <>
          <span style={{ marginRight: "10px" }}>
            {user.displayName}님, 안녕하세요!
          </span>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      )}
    </header>
  );
};

export default MyHeader;
