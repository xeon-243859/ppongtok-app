// src/pages/LovePreviewPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './LovePreviewPage.css';

function LovePreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const previewRef = useRef();
  const [muted, setMuted] = useState(false);

  const {
    message = '',
    emotion = '잔잔한 마음',
    customImage = null,
    customAudio = null,
    theme = {}
  } = location.state || {};

  const backgroundImage = customImage || theme.background || '/images/lovesky.jpg';
  const music = customAudio || theme.music || '/audio/spring.mp3';

  const handleImageDownload = () => {
    html2canvas(previewRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'love_message.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handlePdfDownload = () => {
    html2canvas(previewRef.current).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('love_message.pdf');
    });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className="preview-container">
      <audio autoPlay loop src={music} muted={muted} style={{ display: 'none' }} />
      <div
        className="preview-box"
        ref={previewRef}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{message}</p>
      </div>

      <button className="mute-toggle" onClick={() => setMuted(!muted)}>
        {muted ? '🔇 음악 켜기' : '🔊 음악 끄기'}
      </button>

      <div className="button-box">
        <button onClick={copyLink}>🔗 링크 복사</button>
        <button onClick={() =>
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)
        }>📱 페이스북 공유</button>
        <button onClick={() =>
          window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`)
        }>🐦 트위터 공유</button>
        <button onClick={handleImageDownload}>🖼 이미지 저장</button>
        <button onClick={handlePdfDownload}>📄 PDF 저장</button>
        <button onClick={() => navigate('/love/form')}>🔄 다시 만들기</button>
      </div>
    </div>
  );
}

export default LovePreviewPage;
