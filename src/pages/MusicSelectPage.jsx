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
    if (storedMusic) setSelectedMusic(storedMusic);
    if (storedLabel) setMusicName(storedLabel);
  }, []);

  const handleDelete = () => {
    setSelectedMusic(null);
    setMusicName("");
    localStorage.removeItem("selected-music");
    localStorage.removeItem("selected-music-label");
  };

  const handleMusicFile = () => navigate("/music/theme");
  const handleLocalFile = () => fileInputRef.current.click();

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
  const mediaType = localStorage.getItem("media-type"); // 예: "image" 또는 "video"

  if (mediaType === "video") {
    navigate("/video");
  } else {
    navigate("/image");
  }
};


  const handleNext = () => {
    const selectedType = localStorage.getItem("selected-type");
    if (selectedType === "video") {
      navigate("/preview?type=video");
    } else {
      navigate("/preview?type=image");
    }
  };

  return (
    <div className="music-select-page">
      <div className="typing-text">
        <div className="line1">배경으로 사용할 음악을</div>
        <div className="line2">선택해주세요</div>
      </div>

      <div className="file-button-group">
        <button onClick={handleMusicFile}>배경음악 파일</button>
        <button onClick={handleLocalFile}>내 파일 선택</button>
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
          <span className="music-label">{musicName}</span>
          <div className="audio-wrapper">
            <audio controls autoPlay src={selectedMusic} />
            <button className="delete-button" onClick={handleDelete}>❌</button>
          </div>
        </div>
      )}

      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
