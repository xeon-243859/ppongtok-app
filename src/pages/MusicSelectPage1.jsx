import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const MusicSelectPage1 = () => {
  const [selectedMusic, setSelectedMusic] = useState(localStorage.getItem("selected-music") || "");
  const [selectedLabel, setSelectedLabel] = useState(localStorage.getItem("selected-music-label") || "선택된 음악 없음");

  const navigate = useNavigate();

  const handleMyFile = () => {
    navigate("/music/upload");
  };

  const handleThemeMusic = () => {
    navigate("/music/theme");
  };

  const handleBack = () => {
    navigate("/image/select");
  };

  const handleNext = () => {
    if (selectedMusic) {
      navigate("/preview");
    } else {
      alert("음악을 선택해주세요!");
    }
  };

  return (
    <div className="music-select-page">
      <div className="music-title">
        <div className="line1">배경으로 사용할 음악을</div>
        <div className="line2">선택해주세요</div>
      </div>

      <div className="music-box">
        <p>{selectedLabel}</p>
        <button onClick={handleMyFile}>내 파일 선택</button>
        <button onClick={handleThemeMusic}>배경음악 파일</button>
      </div>

      <div className="button-group">
        <button onClick={handleBack}>← 뒤로가기</button>
        <button onClick={handleNext}>다음으로 →</button>
      </div>
    </div>
  );
};

export default MusicSelectPage1;
