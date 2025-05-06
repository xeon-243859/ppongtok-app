import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LovePreviewPage.css";

function LovePreviewPage() {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMessage = localStorage.getItem("loveMessage") || "당신을 사랑합니다.";
    const images = JSON.parse(localStorage.getItem("selectedImages") || "[]");
    const video = localStorage.getItem("selectedVideo") || null;
    const music = localStorage.getItem("selectedMusic") || null;

    setMessage(storedMessage);
    setSelectedImages(images);
    setSelectedVideo(video);
    setSelectedMusic(music);
  }, []);

  const handleBack = () => {
    navigate("/music/select");
  };

  return (
    <div className="preview-container">
      <h2 className="preview-title">당신만을 위한 사랑 고백 💌</h2>

      {selectedMusic && (
        <audio src={selectedMusic} autoPlay loop />
      )}

      <div className="preview-content">
        {selectedVideo ? (
          <video src={selectedVideo} controls autoPlay loop className="preview-media" />
        ) : selectedImages.length > 0 ? (
          <div className="image-preview">
            {selectedImages.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="preview-image" />
            ))}
          </div>
        ) : null}

        <div className="preview-caption">
          <p>{message}</p>
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleBack} className="back">뒤로가기</button>
        <button className="share">공유하기</button>
      </div>
    </div>
  );
}

export default LovePreviewPage;
