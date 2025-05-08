import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const [selectedVideo, setSelectedVideo] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [typing, setTyping] = useState(["", ""]);
  const lines = [
    "배경으로 사용할 영상파일",
    "1개를 선택해 주세요",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("selected-video") || "";
    setSelectedVideo(stored);

    setTyping(["", ""]); // ✅ 타자체 초기화 확실히 해줌

    let i = 0, j = 0;
    const interval = setInterval(() => {
      setTyping((prev) => {
        const updated = [...prev];
        if (!updated[i]) updated[i] = "";
        updated[i] += lines[i][j];
        return updated;
      });

      j++;
      if (i < lines.length && j >= lines[i].length) {
        i++;
        j = 0;
      }
      if (i >= lines.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setSelectedVideo(base64);
      localStorage.setItem("selected-video", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleStorageVideo = () => {
    navigate("/video/theme");
  };

  const handleDelete = () => {
    localStorage.removeItem("selected-video");
    setSelectedVideo("");
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
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="video-slot">
        {selectedVideo ? (
          <>
            <video
              src={selectedVideo}
              controls
              autoPlay
              loop
              muted
            />
            <button className="delete-button" onClick={handleDelete}>
              삭제
            </button>
          </>
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
