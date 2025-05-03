import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './LovePreviewPage.css';

const LovePreviewPage = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showText, setShowText] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    const storedMessage = localStorage.getItem('message') || '';
    setLines(storedMessage.split('\n'));
  }, []);

  useEffect(() => {
    if (currentLine < lines.length) {
      let index = 0;
      const interval = setInterval(() => {
        setShowText(lines[currentLine].substring(0, index + 1));
        index++;
        if (index >= lines[currentLine].length) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentLine((prev) => prev + 1);
            setShowText('');
          }, 1500);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentLine, lines]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었어요!');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
  };

  const handleDownloadImage = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'love-preview.png';
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('love-preview.pdf');
    }
  };

  const handleRestart = () => {
    window.location.href = '/love/form';
  };

  const background = localStorage.getItem('background') || 'love-background.jpg';
  const music = localStorage.getItem('music') || 'love-theme.mp3';

  return (
    <div className="preview-container" ref={previewRef}>
      <img src={`/images/${background}`} alt="배경" className="background-image" />
      <div className="overlay">
        <p className="love-text">{showText}</p>
        <div className="button-group">
          <button onClick={handleCopyLink}>🔗 링크 복사</button>
          <button onClick={handleFacebookShare}>📘 페이스북 공유</button>
          <button onClick={handleTwitterShare}>🐦 트위터 공유</button>
          <button onClick={handleDownloadImage}>🖼 이미지 저장</button>
          <button onClick={handleDownloadPDF}>📄 PDF 저장</button>
          <button onClick={handleRestart}>🔄 다시 만들기</button>
        </div>
      </div>
      <audio autoPlay loop src={`/audio/${music}`} />
    </div>
  );
};

export default LovePreviewPage;
