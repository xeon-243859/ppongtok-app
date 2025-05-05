import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./SharePage.css";

const SharePage = () => {
  const navigate = useNavigate();
  const resultRef = useRef(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  const handleDownloadImage = () => {
    html2canvas(resultRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "ppongtok-love.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const handleDownloadPDF = () => {
    html2canvas(resultRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
      pdf.save("ppongtok-love.pdf");
    });
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("이 사랑 고백 메시지를 확인해보세요 💘");

    let shareURL = "";
    if (platform === "facebook") {
      shareURL = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "twitter") {
      shareURL = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    }

    window.open(shareURL, "_blank");
  };

  return (
    <div className="share-wrapper">
      <h2>🎉 고백 메시지 완성!</h2>
      <div className="preview-box" ref={resultRef}>
        <p>여기에 당신의 완성된 메시지와 영상/이미지가 표시됩니다.</p>
        <p>✨ (이 부분은 실제 메시지 결과물이 출력될 영역입니다)</p>
      </div>

      <div className="button-group">
        <button onClick={handleCopyLink}>🔗 링크 복사</button>
        <button onClick={handleDownloadPDF}>📄 PDF 저장</button>
        <button onClick={handleDownloadImage}>🖼 이미지 저장</button>
        <button onClick={() => handleShare("facebook")}>📘 페이스북</button>
        <button onClick={() => handleShare("twitter")}>🐦 트위터</button>
        <button onClick={() => navigate("/love/style")}>🔙 뒤로가기</button>
        <button onClick={() => navigate("/love/form")}>🔁 다시 만들기</button>
      </div>
    </div>
  );
};

export default SharePage;
