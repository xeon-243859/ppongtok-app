import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MusicSelectPage.css";

const MusicSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musicName, setMusicName] = useState("");
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 300);
    const timer2 = setTimeout(() => setShowLine2(true), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const savedMusic = localStorage.getItem("selected-music");
    const savedName = localStorage.getItem("selected-music-name");
    if (savedMusic) {
      setSelectedMusic(savedMusic);
      setMusicName(savedName || savedMusic.split("/").pop().replace(".mp3", ""));
    }
  }, []);

  const handleSelectMusicFile = () => {
    navigate("/music/theme");
  };

  const handleLocalFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const name = file.name.replace(".mp3", "");
    setSelectedMusic(url);
    setMusicName(name);
    localStorage.setItem("selected-music", url);
    localStorage.setItem("selected-music-name", name);
  };

  const handleDelete = () => {
    localStorage.removeItem("selected-music");
    localStorage.removeItem("selected-music-name");
    setSelectedMusic(null);
    setMusicName("");
  };

  return (
    <div className="music-select-container">
      {showLine1 && <h2 className="music-title-line1">배경으로 사용할 음악을</h2>}
      {showLine2 && <h2 className="music-title-line2">선택해주세요</h2>}

      <div className="music-button-group">
        <button onClick={handleSelectMusicFile}>배경음악파일</button>
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
          <p className="music-name">{musicName}</p>
          <audio src={selectedMusic} autoPlay controls />
          <button className="delete-button" onClick={handleDelete}>X</button>
        </div>
      )}

      <div className="music-button-nav">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/preview")}>다음으로</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
