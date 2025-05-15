import React, { useEffect } from "react";
import "./SharePage.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SharePage = () => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("여기에_자바스크립트_키"); // ← 네 카카오 JavaScript 키로 바꿔줘!
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
              imageUrl: "https://yourdomain.com/preview-thumbnail.jpg", // 필요시 수정
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
      <div className="share-button-group">
        <button className="share-button" onClick={() => handleShare("kakao")}>카카오톡</button>
        <button className="share-button" onClick={() => handleShare("facebook")}>Facebook</button>
        <button className="share-button" onClick={() => handleShare("twitter")}>Twitter</button>
        <button className="share-button" onClick={() => handleShare("copy")}>링크 복사</button>
        <button className="share-button" onClick={() => handleShare("pdf")}>PDF 저장</button>
        <button className="share-button" onClick={() => handleShare("image")}>이미지 저장</button>
      </div>
    </div>
  );
};

export default SharePage;
