// ✅ SharePage.jsx - messageId 유효성 검사 강화 + 공유 오류 방지

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
    if (!id || id === "undefined" || id.trim() === "") {
      alert("유효하지 않은 공유 링크입니다. 처음부터 다시 시도해 주세요.");
      navigate("/");
      return;
    }
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
      } else {
        alert("공유할 메시지를 찾을 수 없어요. 처음부터 다시 시도해 주세요.");
        navigate("/");
      }
    };
    fetchMessage();
  }, [messageId]);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
      console.log("✅ Kakao SDK 초기화 완료");
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
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("카카오톡 공유를 사용할 수 없습니다.");
      return;
    }
    if (!imageUrl || !messageId || messageId === "undefined") {
      alert("공유할 메시지를 찾을 수 없어요. 다시 시도해 주세요.");
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지 도착 💌",
        description: caption || "누군가 당신에게 마음을 보냈어요",
        imageUrl,
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
      {imageUrl && <img src={imageUrl} alt="미리보기" style={{ maxWidth: "100%" }} />}
      {qrUrl && <img src={qrUrl} alt="QR 코드" style={{ width: "120px", margin: "20px auto" }} />}
      <p>이 QR을 스캔하면 누군가에게 마음이 전해져요</p>
      <button onClick={handleKakaoShare}>💬 카카오톡 공유하기</button>
      <button onClick={() => navigate("/")}>🏠 처음으로</button>
    </div>
  );
};

export default SharePage;
