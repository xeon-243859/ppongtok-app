import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

const SharePage = () => {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState("");

  const shareUrl = "https://ppongtok-app.vercel.app/share/abc123"; // 👉 실제 메시지 링크로 교체
  const videoUrl = "https://firebasestorage.googleapis.com/v0/b/ppongtok-project.firebasestorage.app/o/sample-video.mp4?alt=media";

  // QR 생성 (안전하게 처리)
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("4abf45cca92e802defcd2c15a6615155"); // 🔑 꼭 JavaScript 키!
      console.log("✅ Kakao SDK 초기화 완료");
    }
  }, []);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(shareUrl);
        setQrUrl(url);
      } catch (error) {
        console.error("QR 코드 생성 오류:", error);
      }
    };
    generateQR();
  }, []);

  // 카카오 공유
  const handleKakaoShare = () => {
    if (!window.Kakao) {
      alert("카카오 SDK가 로드되지 않았어요!");
      return;
    }

    if (!window.Kakao.isInitialized()) {
      alert("Kakao 초기화가 되지 않았어요!");
    return;
    }


    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지 도착 💌",
        description: "누군가 당신에게 마음을 보냈어요",
        imageUrl: qrUrl,
        link: {
          mobileWebUrl: "https://ppongtok-app.vercel.app/share",
          webUrl: "https://ppongtok-app.vercel.app/share",
        },
      },
    });
  };

  // 기타 공유
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("링크가 복사되었어요!");
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=누군가 당신에게 마음을 보냈어요`);
  };

  const buttonStyle = {
  padding: "8px 0",
  width: "150px", // ✅ 작게
  fontSize: "13px", // ✅ 작게
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  color: "#333",
  boxShadow: "1px 1px 4px rgba(0,0,0,0.05)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  margin: "4px auto",
  textDecoration: "none"
};


  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>💌 공유하기</h2>

        {qrUrl && <img src={qrUrl} alt="QR 코드" style={styles.qrImage} />}

        <p style={styles.caption}>이 QR을 스캔하면 누군가에게 마음이 전해져요</p>

        <div style={styles.buttonGroup}>
          <button style={buttonStyle} onClick={handleCopyLink}>🔗 링크 복사</button>
          <button style={buttonStyle} onClick={handleKakaoShare}>💬 카카오톡</button>
          <button style={buttonStyle} onClick={handleFacebookShare}>🟦 페이스북</button>
          <button style={buttonStyle} onClick={handleTwitterShare}>🐦 트위터</button>
          <a href={videoUrl} download style={buttonStyle}>🎥 영상 저장</a>
        </div>

        <div style={styles.navGroup}>
          <button style={buttonStyle} onClick={() => navigate("/")}>🏠 처음으로</button>
          <button style={buttonStyle} onClick={() => navigate("/select-category")}>✨ 시작하기</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fffdf8",
    padding: "20px",
  },
  container: {
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
 
  qrImage: {
  width: "150px",
  margin: "0 auto"
},

  caption: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#666"
  },

  buttonGroup: {
  marginTop: "20px",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px"
},

   navGroup: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }
};

export default SharePage;
