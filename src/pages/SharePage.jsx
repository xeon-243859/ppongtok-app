import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const SharePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();

  const [qrUrl, setQrUrl] = useState("");
  const [messageId, setMessageId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");

  // URL에서 messageId 파싱
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    setMessageId(id);
  }, [location.search]);

  // Firestore에서 메시지 불러오기
  useEffect(() => {
    const fetchMessage = async () => {
      if (!messageId) return;
      const docRef = doc(db, "messages", messageId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setImageUrl(data.imageUrl || "");
        setVideoUrl(data.videoUrl || "");
        setCaption(data.caption || "");
      } else {
        alert("공유할 메시지를 찾을 수 없어요.");
      }
    };
    fetchMessage();
  }, [messageId]);

  // Kakao SDK 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
      console.log("✅ Kakao SDK 초기화 완료");
    }
  }, []);

  // QR 생성
  const shareUrl = messageId ? `https://ppongtok-app.vercel.app/view/${messageId}` : "";

  useEffect(() => {
    const generateQR = async () => {
      if (!shareUrl) return;
      try {
        const url = await QRCode.toDataURL(shareUrl);
        setQrUrl(url);
      } catch (error) {
        console.error("QR 코드 생성 오류:", error);
      }
    };
    generateQR();
  }, [shareUrl]);

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("카카오톡 공유를 사용할 수 없습니다.");
      return;
    }
    if (!imageUrl || !messageId) {
      alert("공유할 메시지를 찾을 수 없어요.");
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지 도착 💌",
        description: "누군가 당신에게 마음을 보냈어요",
        imageUrl,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    });
  };

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
    width: "150px",
    fontSize: "13px",
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
        
        {caption && ( // ✅ 자막 보여주기
  <p className="shared-caption" style={{ marginTop: "16px", fontSize: "18px", color: "#444", textAlign: "center" }}>
    {caption}
  </p>
)}
        <div style={styles.buttonGroup}>
          <button style={buttonStyle} onClick={handleCopyLink}>🔗 링크 복사</button>
          <button style={buttonStyle} onClick={handleKakaoShare}>💬 카카오톡</button>
          <button style={buttonStyle} onClick={handleFacebookShare}>🟦 페이스북</button>
          <button style={buttonStyle} onClick={handleTwitterShare}>🐦 트위터</button>
          {videoUrl ? (
            <a href={videoUrl} download style={buttonStyle}>🎥 영상 저장</a>
          ) : (
            <div style={{ ...buttonStyle, opacity: 0.5 }}>영상 없음</div>
          )}
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


