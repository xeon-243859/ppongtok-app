import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const MusicSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musicName, setMusicName] = useState("");

  useEffect(() => {
    const storedMusic = localStorage.getItem("selected-music");
    const storedLabel = localStorage.getItem("selected-music-label");

    if (storedMusic) {
      setSelectedMusic(storedMusic);
    }

    if (storedLabel) {
      setMusicName(storedLabel);
    }
  }, []);

  const handleDelete = () => {
    setSelectedMusic(null);
    setMusicName("");
    localStorage.removeItem("selected-music");
    localStorage.removeItem("selected-music-label");
  };

  const handleMusicFile = () => {
    navigate("/music/theme");
  };

  const handleLocalFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const musicUrl = URL.createObjectURL(file);
    setSelectedMusic(musicUrl);
    setMusicName(file.name);
    localStorage.setItem("selected-music", musicUrl);
    localStorage.setItem("selected-music-label", file.name);
  };

  const handleBack = () => {
    navigate("/video/theme");
  };

  const handleNext = () => {
    navigate("/preview");
  };

  return (
    <div className="music-select-page">
      <h2 className="music-select-title">
        배경으로 사용할 음악을<br />선택해주세요
      </h2>

      <div className="file-button-group">
        <button onClick={handleMusicFile}>배경음악파일</button>
        <button onClick={handleLocalFile}>내파일선택</button>
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {selectedMusic && (
        <div className="music-box">
          <p className="music-label">{musicName || "선택된 음악 없음"}</p>
          <audio controls autoPlay src={selectedMusic} />
          <button className="delete-button" onClick={handleDelete}>❌</button>
        </div>
      )}

      <div className="button-group centered">
        <button className="back-button" onClick={handleBack}>뒤로가기</button>
        <button className="next-button" onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
