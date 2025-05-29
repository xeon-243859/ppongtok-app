// ✅ SharePage.jsx - 이미지 제거 + 버튼 정리

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

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    setMessageId(id);
  }, [location.search]);

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
      }
    };
    fetchMessage();
  }, [messageId]);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
    }
  }, []);

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
    if (!window.Kakao || !window.Kakao.isInitialized()) return;
    if (!messageId) return;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지 도착 💌",
        description: caption || "누군가 당신에게 마음을 보냈어요",
        imageUrl: imageUrl || "https://via.placeholder.com/600x400.png?text=PPONGTOK",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    });
  };

  return (
    <div>
      <h2>💌 공유하기</h2>
      {caption && <p>{caption}</p>}
      {qrUrl && <img src={qrUrl} alt="QR 코드" style={{ width: "120px", margin: "20px auto" }} />}
      <p>이 QR을 스캔하면 누군가에게 마음이 전해져요</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", marginTop: "20px" }}>
        <button onClick={handleKakaoShare}>💬 카카오톡 공유하기</button>
        <button onClick={() => navigate("/")}>🏠 처음으로</button>
      </div>
    </div>
  );
};

export default SharePage;
