import React, { useEffect, useState } from "react";
import "../styles/PreviewPage.css";

function PreviewPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const img = localStorage.getItem("selected-image");
    const vid = localStorage.getItem("selected-video");
    const msg = localStorage.getItem("message");
    setSelectedImage(img);
    setSelectedVideo(vid);
    setMessage(msg);
  }, []);

  return (
    <div className="preview-container">
      {selectedImage && (
        <img src={selectedImage} alt="Selected Background" className="background-media" />
      )}

      {selectedVideo && (
        <video
          src={selectedVideo}
          className="background-media"
          autoPlay
          loop
          muted
        />
      )}

      <div className="message-overlay">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default PreviewPage;
