import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const MusicSelectPage = () => {
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
    const selectedType = localStorage.getItem("selected-type");
    if (selectedType === "video") {
      navigate("/video/select");
    } else {
      navigate("/image/select");
    }
  };

  const handleNext = () => {
    if (selectedMusic) {
      navigate("/preview");
    } else {
      alert("음악을 선택해주세요!");
    }
  };

  const handleDelete = () => {
    localStorage.removeItem("selected-music");
    localStorage.removeItem("selected-music-label");
    setSelectedMusic("");
    setSelectedLabel("선택된 음악 없음");
  };

  return (
    <div className="music-select-page">
      <div className="music-title">
        <div className="line1">배경으로 사용할 음악을</div>
        <div className="line2">선택해주세요</div>
      </div>

      <div className="music-buttons">
        <button onClick={handleThemeMusic}>배경음악 파일</button>
        <button onClick={handleMyFile}>내 파일 선택</button>
      </div>

      <div className="music-preview">
        <p>{selectedLabel}</p>
        {selectedMusic && (
          <>
            <audio controls>
              <source src={selectedMusic} type="audio/mp3" />
              브라우저가 오디오 태그를 지원하지 않습니다.
            </audio>
            <button className="delete-button" onClick={handleDelete}>❌ 음악 삭제</button>
          </>
        )}
      </div>

      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
