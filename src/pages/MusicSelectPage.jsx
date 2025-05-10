// ✅ MusicSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const MusicSelectPage = () => {
  const navigate = useNavigate();
  const selected = localStorage.getItem("music-0");

  const handleSelect = () => {
    localStorage.setItem("selected-slot", "music-0");
    navigate("/music/theme");
  };

  const handleRemove = () => {
    localStorage.removeItem("music-0");
    navigate(0);
  };

  const handleNext = () => {
    if (!selected) {
      alert("음악을 선택해주세요");
      return;
    }
    navigate("/preview");
  };

  return (
    <div className="music-select-container">
      <h2 className="music-title">배경음악선택하기</h2>

      <div className="music-button-row">
        <button className="file-select-button" onClick={handleSelect}>배경음악파일</button>
        <button className="file-select-button" onClick={() => alert("내파일선택은 추후 구현")}>내파일선택</button>
      </div>

      {/* 선택된 음악이 있을 경우 */}
      {selected && (
        <div className="selected-music-box">
          <p className="music-label">Music--01</p>
          <audio src={selected} controls className="audio-preview" />
          <button className="remove-button" onClick={handleRemove}>X</button>
        </div>
      )}

      <div className="music-button-group">
        <button className="back-button" onClick={() => navigate("/video/select")}>뒤로가기</button>
        <button className="next-button" onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
