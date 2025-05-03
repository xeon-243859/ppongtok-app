// src/pages/LovePreviewPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './LovePreviewPage.css';

const emotionThemes = {
  '잔잔한 마음': {
    image: '/images/lovesky.jpg',
    music: '/audio/mueon.mp3',
    textStyle: { color: 'white', fontSize: '32px' },
  },
  '설레는 마음': {
    image: '/images/lovelove.png',
    music: '/audio/mueon1.mp3',
    textStyle: { color: 'pink', fontSize: '32px' },
  },
  '따뜻한 기억': {
    image: '/images/likeyou.png',
    music: '/audio/spring.mp3',
    textStyle: { color: 'lightyellow', fontSize: '32px' },
  },
};

function LovePreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const previewRef = useRef();
  const [theme, setTheme] = useState(null);

  const message = location.state?.message || '';
  const emotion = location.state?.emotion || '잔잔한 마음';
  const customImage = location.state?.customImage || null;
  const customAudio = location.state?.customAudio || null;

  useEffect(() => {
    if (emotionThemes[emotion]) {
      setTheme(emotionThemes[emotion]);
    }
  }, [emotion]);

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
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
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
      {theme && (
        <>
          <audio autoPlay loop src={customAudio || theme.music}></audio>
          <div
            className="preview-box"
            ref={previewRef}
            style={{
              backgroundImage: `url(${customImage || theme.image})`,
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
            <p style={theme.textStyle}>{message}</p>
          </div>

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
        </>
      )}
    </div>
  );
}

export default LovePreviewPage;
