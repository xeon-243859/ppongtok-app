import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // 또는 로딩 스피너 컴포넌트 넣어도 OK

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
