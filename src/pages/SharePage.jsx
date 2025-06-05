import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const SharePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [qrUrl, setQrUrl] = useState("");
  const [messageId, setMessageId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");

const saveMessage = async ({ caption, imageUrl, videoUrl, musicUrl }) => {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      caption,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      musicUrl: musicUrl || null,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("메시지 저장 실패:", error);
    return null;
  }
};


  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    setMessageId(id);
  }, [location.search]);

  useEffect(() => {
  const caption = localStorage.getItem("caption");
  const imageUrl = localStorage.getItem("selected-image");
  const videoUrl = localStorage.getItem("selected-video");
  const musicUrl = localStorage.getItem("selected-music");

  if (!messageId && caption && (imageUrl || videoUrl)) {
    saveMessage({ caption, imageUrl, videoUrl, musicUrl }).then((id) => {
      if (id) {
        setMessageId(id);
      }
    });
  }
}, []);


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

  const shareUrl = messageId
  ? `https://ppongtok-app.vercel.app/api/view/${messageId}`
  : "https://ppongtok-app.vercel.app";


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

  // ✅ handleKakaoShare 수정
  const handleKakaoShare = async () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) return;

    if (!currentUser) {
      alert("로그인이 필요해요 💌");
      navigate("/login");
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("유저 정보를 찾을 수 없습니다.");
      return;
    }

    const freePass = userSnap.data().freePassCount || 0;
    if (freePass < 1) {
      alert("무료 이용권이 소진되었습니다. 결제가 필요해요.");
      navigate("/payment");
      return;
    }

    await updateDoc(userRef, { freePassCount: freePass - 1 });

    const previewImage =
      imageUrl ||
      (videoUrl
        ? "https://ppongtok-app.vercel.app/thumbnail/video-default.jpg"
        : "https://via.placeholder.com/600x400.png?text=PPONGTOK");

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지 도착 💌",
        description: caption || "누군가 당신에게 마음을 보냈어요",
        imageUrl: previewImage,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("링크가 복사되었습니다 ✨");
  };

  const handleImageDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "ppongtok-image.jpg";
    link.click();
  };

  const handleVideoDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "ppongtok-video.mp4";
    link.click();
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 16px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>💌 공유하기</h2>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="공유 이미지"
          style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "12px", marginBottom: "16px" }}
        />
      )}

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          style={{ width: "100%", maxHeight: "500px", borderRadius: "12px", marginBottom: "16px" }}
        />
      )}

      {caption && <p style={{ fontSize: "16px", color: "#444", marginBottom: "24px" }}>{caption}</p>}

      {qrUrl && <img src={qrUrl} alt="QR 코드" style={{ width: "150px", margin: "0 auto 16px" }} />}
      <p style={{ fontSize: "14px", color: "#777" }}>이 QR을 스캔하면 누군가에게 마음이 전해져요</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "32px" }}>
        <button onClick={handleKakaoShare} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#FAE100", border: "none", fontWeight: "bold" }}>
          💬 카카오톡 공유하기
        </button>
        <button onClick={handleCopy} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#cce5ff", border: "none", fontWeight: "bold" }}>
          🔗 링크 복사
        </button>
        {imageUrl && (
          <button onClick={handleImageDownload} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#d4edda", border: "none", fontWeight: "bold" }}>
            🖼️ 이미지 저장
          </button>
        )}
        {videoUrl && (
          <button onClick={handleVideoDownload} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#fce4ec", border: "none", fontWeight: "bold" }}>
            🎥 영상 저장
          </button>
        )}
        <button onClick={() => window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(shareUrl), "_blank")} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#1DA1F2", color: "white", fontWeight: "bold" }}>
          🐦 트위터 공유
        </button>
        <button onClick={() => window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl), "_blank")} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#4267B2", color: "white", fontWeight: "bold" }}>
          📘 페이스북 공유
        </button>
        <button onClick={() => navigate("/")} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#eee", border: "none", fontWeight: "bold" }}>
          🏠 처음으로
        </button>
        <button onClick={() => navigate("/intro")} style={{ padding: "4px", fontSize: "12px", borderRadius: "8px", background: "#f8d7da", border: "none", fontWeight: "bold" }}>
          🚀 시작하기
        </button>
      </div>
    </div>
  );
};

export default SharePage;
