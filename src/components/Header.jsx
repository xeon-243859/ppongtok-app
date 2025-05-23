import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Header = () => {
  const { user } = useAuth();
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

export default Header;
