// src/pages/CompletePage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "../styles/CompletePage.css";

const CompletePage = () => {
  const navigate = useNavigate();
  const selectedVideo = localStorage.getItem("selectedVideo");
  const message = "너를 처음 만난 그날부터\n내 마음은 온통 너로 가득했어\n이제는 말할게\n널 사랑해";

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다!");
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("preview-area");
    html2pdf().from(element).save("ppongtok-love.pdf");
  };

  return (
    <div className="complete-wrapper">
      <h2>💝 당신의 사랑 메시지가 완성되었어요!</h2>

      <div id="preview-area" className="preview-box">
        {selectedVideo ? (
          <video
            src={`/videos/${selectedVideo}`}
            controls
            autoPlay
            loop
            muted
            className="preview-video"
          />
        ) : (
          <div className="no-video">영상이 없습니다</div>
        )}
        <div className="message-box">
          {message.split("\n").map((line, index) => (
            <p key={index} className="line">{line}</p>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleCopy}>🔗 링크 복사</button>
        <button onClick={handleDownloadPDF}>📄 PDF 저장</button>
        <button onClick={() => navigate("/")}>↩ 다시 만들기</button>
      </div>
    </div>
  );
};

export default CompletePage;
