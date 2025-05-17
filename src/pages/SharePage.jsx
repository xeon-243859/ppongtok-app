import React, { useEffect } from "react";
import "./SharePage.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const SharePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("여기에_자바스크립트_키");
      console.log("✅ Kakao 초기화 완료");
    }
  }, []);

  const handleShare = (type) => {
    switch (type) {
      case "kakao":
        if (window.Kakao && window.Kakao.Share) {
          window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: "감정을 담은 뿅!톡 메시지",
              description: "내 마음을 전하는 감성 메시지를 확인해보세요 💌",
              imageUrl: "https://yourdomain.com/preview-thumbnail.jpg",
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
            buttons: [
              {
                title: "지금 확인하기",
                link: {
                  mobileWebUrl: window.location.href,
                  webUrl: window.location.href,
                },
              },
            ],
          });
        }
        break;

      case "facebook":
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + window.location.href);
        break;

      case "twitter":
        window.open("https://twitter.com/intent/tweet?url=" + window.location.href);
        break;

      case "copy":
        navigator.clipboard.writeText(window.location.href);
        alert("링크가 복사되었습니다!");
        break;

      case "pdf":
        const captureTarget = document.body;
        html2canvas(captureTarget).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * pageWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
          pdf.save("ppongtok-message.pdf");
        });
        break;

      case "image":
        const target = document.body;
        html2canvas(target).then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "ppongtok-message.png";
          link.click();
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className="share-page">
      <h1 className="share-title">이제 이 감정을<br />함께 나눠볼까요?</h1>

      <div className="share-button-group responsive">
        <button className="share-button" onClick={() => handleShare("kakao")}>카카오톡</button>
        <button className="share-button" onClick={() => handleShare("facebook")}>Facebook</button>
        <button className="share-button" onClick={() => handleShare("twitter")}>Twitter</button>
        <button className="share-button" onClick={() => handleShare("copy")}>링크 복사</button>
        <button className="share-button" onClick={() => handleShare("pdf")}>PDF 저장</button>
        <button className="share-button" onClick={() => handleShare("image")}>이미지 저장</button>
      </div>

      {/* 📌 공유 방식 안내 문구 추가 */}
      <div className="share-guide" style={{ marginTop: "40px", textAlign: "left", maxWidth: "500px", fontSize: "14px", color: "#444", lineHeight: "1.6" }}>
        <p>🔗 <strong>링크 복사:</strong> 복사된 링크는 클립보드에 저장되며, 카카오톡이나 문자창에 붙여넣을 수 있어요. (Ctrl+V 또는 길게 눌러 붙여넣기)</p>
        <p>📄 <strong>PDF 저장:</strong> 화면 전체가 PDF 파일로 저장되며, 보통 <strong>다운로드 폴더</strong>에서 확인할 수 있어요.</p>
        <p>🖼️ <strong>이미지 저장:</strong> 메시지 화면이 이미지로 저장되며, 역시 <strong>다운로드 폴더</strong>에서 찾을 수 있어요. 모바일에선 저장 알림이 뜨기도 해요.</p>
      </div>

      <div className="button-box" style={{ marginTop: "30px" }}>
        <button className="styled-button" onClick={() => navigate("/preview")}>뒤로가기</button>
      </div>
    </div>
  );
};

export default SharePage;
