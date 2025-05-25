import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

const SharePage = () => {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState("");

  const shareUrl = "https://ppongtok-app.vercel.app/share/abc123"; // 👉 실제 공유 링크로 바꿔줘
  const videoUrl = "https://firebasestorage.googleapis.com/v0/b/ppongtok-project.appspot.com/o/sample-video.mp4?alt=media";

  useEffect(() => {
    QRCode.toDataURL(shareUrl).then(setQrUrl);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("링크가 복사되었어요!");
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) return alert("카카오 SDK가 로드되지 않았어요!");
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지 도착 💌",
        description: "누군가 당신에게 마음을 보냈어요",
        imageUrl: qrUrl,
        link: {
          webUrl: shareUrl,
          mobileWebUrl: shareUrl,
        },
      },
    });
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=누군가 당신에게 마음을 보냈어요`);
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "6px 0",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#333",
    boxShadow: "2px 2px 6px rgba(0,0,0,0.05)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "220px",
  };

  const navButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f9f9f9",
    border: "1.5px solid #ccc",
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
          <a href={videoUrl} download style={{ ...buttonStyle, textDecoration: "none" }}>🎥 영상 저장</a>
        </div>

        <div style={styles.navGroup}>
          <button style={navButtonStyle} onClick={() => navigate("/")}>🏠 처음으로</button>
          <button style={navButtonStyle} onClick={() => navigate("/select-category")}>✨ 시작하기</button>
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
    width: "200px",
    margin: "0 auto",
  },
  caption: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#666",
  },
  buttonGroup: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  navGroup: {
    marginTop: "40px",
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
};

export default SharePage;
