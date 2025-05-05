import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js"; // ✅ PDF 저장 기능용 라이브러리
import "../styles/LovePreviewPage.css";

const PreviewPage = () => {
  const [message, setMessage] = useState("");
  const [bgType, setBgType] = useState("");
  const [bg, setBg] = useState("");
  const [music, setMusic] = useState("");

  useEffect(() => {
    setMessage(localStorage.getItem("loveMessage") || "");
    setBgType(localStorage.getItem("backgroundType") || "image");
    setBg(localStorage.getItem("background") || "");
    setMusic(localStorage.getItem("music") || "");
  }, []);

  // ✅ PDF 저장 함수
  const handleDownloadPDF = () => {
    const element = document.querySelector(".preview-page");
    html2pdf().from(element).save("ppongtok-love.pdf");
  };

  return (
    <div className="preview-page">
      {/* 🎵 음악 재생 */}
      {music && <audio autoPlay loop src={music} />}

      {/* 🎨 배경 출력 */}
      {bgType === "image" ? (
        <img src={bg} alt="background" className="preview-bg" />
      ) : (
        <video src={bg} className="preview-bg" autoPlay loop muted />
      )}

      {/* 💌 메시지 출력 */}
      <div className="subtitle">{message}</div>

      {/* 🎁 공유/저장 버튼 묶음 */}
      <div className="button-group">
        <button onClick={handleDownloadPDF}>📄 PDF 저장</button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("링크가 복사되었습니다!");
          }}
        >
          📋 링크 복사
        </button>

        <button
          onClick={() => {
            const shareUrl = encodeURIComponent(window.location.href);
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
              "_blank"
            );
          }}
        >
          👍 페이스북 공유
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
