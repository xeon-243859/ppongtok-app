// ✅ VideoEntryPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./VideoEntryPage.css";

const VideoEntryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="entry-page-container">
      <h1 className="entry-title">배경으로 사용할 영상파일</h1>
      <h2 className="entry-subtitle">1개를 선택해주세요</h2>

      <div className="entry-button-group">
        <button className="entry-button" onClick={() => navigate("/video/select")}>동영상파일</button>
        <button className="entry-button" onClick={() => navigate("/video/upload")}>내파일선택</button>
      </div>
    </div>
  );
};

export default VideoEntryPage;