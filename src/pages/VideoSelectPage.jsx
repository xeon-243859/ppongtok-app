import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";
import VideoSelectPage from "./pages/VideoSelectPage";

const VideoSelectPage = () => {
  const [selectedVideo, setSelectedVideo] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [typing, setTyping] = useState(["", ""]);
  const lines = [
    "배경으로 사용할 동영상파일 1개를",
    "선택해주세요",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("selected-video") || "";
    setSelectedVideo(stored);

    let i = 0;
    let j = 0;
    const typingInterval = setInterval(() => {
      setTyping((prev) => {
        const updated = [...prev];
        updated[i] += lines[i][j];
        return updated;
      });
      j++;
      if (j >= lines[i].length) {
        i++;
        j = 0;
      }
      if (i >= lines.length) clearInterval(typingInterval);
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedVideo(url);
    localStorage.setItem("selected-video", url);
  };

  const handleStorageVideo = () => {
    navigate("/video/theme");
  };

  return (
    <div className="video-select-container">
      <h2>{typing[0]}</h2>
      <h2>{typing[1]}</h2>

      <div className="button-group">
        <button onClick={handleStorageVideo}>동영상파일</button>
        <button onClick={handleFileSelect}>내파일선택</button>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="video-slot">
        {selectedVideo ? (
          <video src={selectedVideo} controls autoPlay loop muted />
        ) : (
          <p>moving-01</p>
        )}
      </div>

      <div className="button-group">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
