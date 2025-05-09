// ✅ VideoEntryPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoEntryPage.css";

const VideoEntryPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(true); // true for mockup

  return (
    <div className="entry-page-container">
      <div className="entry-text-block">
        <h1 className="entry-title">배경으로 사용할 영상파일</h1>
        <h2 className="entry-subtitle">1개를 선택해주세요</h2>
      </div>

      <div className="entry-button-group">
        <button className="entry-button" onClick={() => navigate("/video/select")}>동영상파일</button>
        <button className="entry-button" onClick={() => navigate("/video/upload")}>내파일선택</button>
      </div>

      {selected && (
        <div className="selected-box">
          <div className="moving-text">moving file</div>
          <button className="remove-button" onClick={() => setSelected(false)}>X</button>
        </div>
      )}

      <div className="nav-button-group">
        <button className="nav-button" onClick={() => navigate(-1)}>뒤로가기</button>
        <button className="nav-button" onClick={() => navigate("/video/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoEntryPage;