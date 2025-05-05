import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSelectPage.css";

const VideoSelectPage = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState("/videos/flower.mp4");
  const [selectedMusic, setSelectedMusic] = useState("/audio/mueon.mp3");

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
    }
  };

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMusic(url);
    }
  };

  const handleNext = () => {
    localStorage.setItem("selectedVideo", selectedVideo);
    localStorage.setItem("selectedMusic", selectedMusic);
    navigate("/love/preview");
  };

  return (
    <div className="video-select-wrapper">
      <h2 className="title">영상 배경을 선택하세요</h2>
      <div className="video-options">
        {["flower.mp4", "river.mp4", "sky.mp4", "sunset.mp4"].map((vid, i) => (
          <button
            key={i}
            className={selectedVideo.includes(vid) ? "selected" : ""}
            onClick={() => setSelectedVideo(`/videos/${vid}`)}
          >
            🎥 {vid.replace(".mp4", "")}
          </button>
        ))}
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
      </div>

      <h2 className="title">배경 음악을 선택하세요</h2>
      <div className="music-options">
        {["mueon.mp3", "mueon1.mp3", "spring.mp3", "spring1.mp3"].map((track, i) => (
          <button
            key={i}
            className={selectedMusic.includes(track) ? "selected" : ""}
            onClick={() => setSelectedMusic(`/audio/${track}`)}
          >
            🎵 {track.replace(".mp3", "")}
          </button>
        ))}
        <input type="file" accept="audio/*" onChange={handleMusicUpload} />
      </div>

      <audio src={selectedMusic} autoPlay loop />

      <div className="button-group">
        <button onClick={() => navigate("/love/style")}>🔙 뒤로가기</button>
        <button onClick={handleNext}>➡️ 다음으로</button>
      </div>
    </div>
  );
};

export default VideoSelectPage;
