import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

const SharePage = () => {
  const [qrUrl, setQrUrl] = useState("");
  const navigate = useNavigate();

  const shareUrl = "https://ppongtok-app.vercel.app/share/abc123"; // 실제 메시지 링크
  const videoUrl = "https://firebasestorage.googleapis.com/v0/b/ppongtok-project.appspot.com/o/sample-video.mp4?alt=media";

  // QR 코드 생성
  useEffect(() => {
    QRCode.toDataURL(shareUrl).then(setQrUrl);
  }, []);

  // 공유 핸들러
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
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl }
      },
    });
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=누군가 당신에게 마음을 보냈어요`);
  };

  return (
    <div className="share-container" style={styles.container}>
      <h2 style={styles.title}>💌 공유하기</h2>

      {qrUrl && <img src={qrUrl} alt="QR 코드" style={styles.qrImage} />}

      <p style={styles.caption}>이 QR을 스캔하면 누군가에게 마음이 전해져요</p>

      <div style={styles.buttonGroup}>
        <button onClick={handleCopyLink}>🔗 링크 복사</button>
        <button onClick={handleKakaoShare}>💬 카카오톡</button>
        <button onClick={handleFacebookShare}>🟦 페이스북</button>
        <button onClick={handleTwitterShare}>🐦 트위터</button>
        <a href={videoUrl} download style={styles.downloadLink}>🎥 영상 저장</a>
      </div>

      <div style={styles.navGroup}>
        <button onClick={() => navigate("/")}>🏠 처음으로</button>
        <button onClick={() => navigate("/select-category")}>🔄 다시 만들기</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#fffdf8",
    fontFamily: "Apple SD Gothic Neo, sans-serif"
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333"
  },
  qrImage: {
    width: "200px",
    margin: "0 auto"
  },
  caption: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#666"
  },
  buttonGroup: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center"
  },
  downloadLink: {
    textDecoration: "none",
    color: "#000",
    background: "#f0f0f0",
    padding: "8px 12px",
    borderRadius: "8px"
  },
  navGroup: {
    marginTop: "40px",
    display: "flex",
    gap: "16px",
    justifyContent: "center"
  }
};

export default SharePage;
