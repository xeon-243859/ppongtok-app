import React, { useState, useRef } from "react";
import "./LovePreviewPage.css";
import TypewriterText from "../components/TypewriterText";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LovePreviewPage = () => {
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef();

  const handleStart = () => {
    setStarted(true);
  };

  const handleFinish = () => {
    if (text.trim()) {
      setShowPreview(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  const handleDownloadPDF = async () => {
    const element = previewRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("love-message.pdf");
  };

  return (
    <div className="love-preview-container" ref={previewRef}>
      {/* ✅ 항상 로딩되도록 오디오 코드 따로 삽입 */}
      <audio autoPlay loop>
        <source src="/music/mueon1.mp3" type="audio/mpeg" />
        브라우저가 오디오를 지원하지 않습니다.
      </audio>

      {!started && (
        <button className="start-button" onClick={handleStart}>
          시작하기
        </button>
      )}

      {started && !showPreview && (
        <div className="input-box">
          <textarea
            placeholder="자막 내용을 입력해 주세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="finish-button" onClick={handleFinish}>
            완료
          </button>
        </div>
      )}

      {showPreview && (
        <>
          <h1 className="title">너를 위한 사랑 고백</h1>
          <TypewriterText text={text} speed={80} />
          <div className="button-group">
            <button onClick={handleCopyLink}>🔗 공유하기</button>
            <button onClick={handleDownloadPDF}>📄 PDF 저장</button>
          </div>
        </>
      )}
    </div>
  );
};

export default LovePreviewPage;
