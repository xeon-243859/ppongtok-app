import React, { useRef } from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter
import html2pdf from "html2pdf.js";
import "@/styles/ShareCompletePage.css"; // ✅ Next.js 스타일 경로로 수정

export default function ShareCompletePage() {
  const router = useRouter();
  const pdfRef = useRef();

  const handleCopyLink = () => {
    const dummyLink = window.location.href;
    navigator.clipboard.writeText(dummyLink);
    alert("링크가 복사되었습니다!");
  };

  const handleDownloadPDF = () => {
    if (pdfRef.current) {
      html2pdf().from(pdfRef.current).save("ppongtok-love-message.pdf");
    }
  };

  const handleShareSNS = () => {
    alert("SNS 공유 기능은 곧 연결됩니다!");
  };

  return (
    <div className="share-wrapper">
      <div ref={pdfRef} className="pdf-content">
        <h2 className="share-title">🎉 고백 메시지가 완성되었어요!</h2>
        <p className="share-sub">이제 친구에게 공유하거나 저장해보세요</p>
      </div>

      <div className="share-buttons">
        <button onClick={handleCopyLink}>🔗 링크 복사</button>
        <button onClick={handleDownloadPDF}>📄 PDF 저장</button>
        <button onClick={handleShareSNS}>📣 SNS 공유</button>
      </div>

      <div className="share-nav">
        <button onClick={() => router.push("/")}>처음으로 돌아가기</button>
      </div>
    </div>
  );
}
