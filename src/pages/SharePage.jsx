import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

const SharePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();

  const { selectedImages, selectedVideo, mediaType, captionText } = location.state || {};
  const [qrUrl, setQrUrl] = useState("");
  const [messageId, setMessageId] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const saveMessage = async () => {
      if (!selectedImages && !selectedVideo) return;

      const newMessage = {
        imageUrl: selectedImages?.[0] || "",
        videoUrl: selectedVideo || "",
        caption: captionText || "",
        createdAt: new Date(),
      };

      try {
        const docRef = await addDoc(collection(db, "messages"), newMessage);
        const id = docRef.id;
        setMessageId(id);
        setShareUrl(`https://ppongtok-app.vercel.app/view/${id}`);
      } catch (err) {
        console.error("메시지 저장 실패", err);
      }
    };

    saveMessage();
  }, [selectedImages, selectedVideo, captionText]);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("YOUR_KAKAO_JAVASCRIPT_KEY");
    }
  }, []);

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

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지 도착 💌",
        description: captionText || "누군가 당신에게 마음을 보냈어요",
        imageUrl: selectedImages?.[0] || "",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    });
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    alert("링크가 복사되었어요!");
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>💌 공유하기</h2>

      {qrUrl && <img src={qrUrl} alt="QR 코드" style={{ width: "150px" }} />}

      <p>이 QR을 스캔하면 누군가에게 마음이 전해져요</p>

      <div>
        <button onClick={handleCopyLink}>🔗 링크 복사</button>
        <button onClick={handleKakaoShare}>💬 카카오톡</button>
        {selectedVideo ? (
          <a href={selectedVideo} download>🎥 영상 저장</a>
        ) : (
          <p style={{ opacity: 0.5 }}>영상 없음</p>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <button onClick={() => navigate("/")}>🏠 처음으로</button>
        <button onClick={() => navigate("/select-category")}>✨ 시작하기</button>
      </div>
    </div>
  );
};

export default SharePage;
