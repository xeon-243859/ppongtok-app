import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

function LovePreviewPage() {
  const captureRef = useRef(null);

  useEffect(() => {
    const captureImage = async () => {
      if (!captureRef.current) return;
      try {
        const canvas = await html2canvas(captureRef.current);
        const imgData = canvas.toDataURL('image/png');
        console.log('Captured Image:', imgData);
      } catch (error) {
        console.error('html2canvas failed:', error);
      }
    };

    captureImage();
  }, []);

  return (
    <div style={{ background: '#fff', height: '100vh' }}>
      <div ref={captureRef} style={{ padding: '20px', textAlign: 'center' }}>
        <h1>사랑의 메시지</h1>
        <p>당신의 마음을 담은 고백이 여기에 담겨 있습니다.</p>
      </div>
    </div>
  );
}

export default LovePreviewPage;
