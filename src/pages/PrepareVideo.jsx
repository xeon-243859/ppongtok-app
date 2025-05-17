// src/pages/PrepareVideo.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrepareVideo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("last-page", "/style/select");
    navigate("/video/select", { replace: true });
  }, [navigate]);

  return null;
};

export default PrepareVideo;
