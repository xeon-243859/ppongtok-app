import React, { useEffect, useRef } from 'react';

function LovePreviewPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // 브라우저 환경에서만 실행되도록 설정
    if (typeof window !== 'undefined') {
      import('html2canvas').then((html2canvas) => {
        const target = document.getElementById('captureTarget');
        if (target) {
          html2canvas.default(target).then((canvas) => {
            if (canvasRef.current) {
              canvasRef.current.innerHTML = ''; // 기존 캔버스 제거
              canvasRef.current.appendChild(canvas);
            }
          });
        }
      });
    }
  }, []);

  return (
    <div>
      <div id="captureTarget">
        <h2>💕 사랑의 메시지를 담아...</h2>
        <p>이 영역이 캡처됩니다.</p>
      </div>

      <div ref={canvasRef} style={{ marginTop: '20px' }}>
        {/* html2canvas로 생성된 캔버스가 여기에 붙어요 */}
      </div>
    </div>
  );
}

export default LovePreviewPage;
