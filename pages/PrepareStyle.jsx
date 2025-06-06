// src/pages/PrepareStyle.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrepareStyle = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/style/select", { replace: true });
  }, [navigate]);

  return null;
};

export default PrepareStyle;
