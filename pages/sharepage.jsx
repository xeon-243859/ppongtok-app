import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import QRCode from "qrcode";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";


export default function SharePage() {
  const [kakaoReady, setKakaoReady] = useState(false); // ✅ SDK 초기화 상태 추적용 state
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [qrUrl, setQrUrl] = useState("");
  const [messageId, setMessageId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");

  const shareUrl = useMemo(() => {
    return messageId
      ? `https://ogmeta-lqxptgkh3q-uc.a.run.app/${messageId}`
      : "";
  }, [messageId]);

  const saveMessage = async ({ caption, imageUrl, videoUrl, musicUrl }) => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        caption,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        musicUrl: musicUrl || null,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("메시지 저장 실패:", error);
      return null;
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    setMessageId(id);
  }, []);

  useEffect(() => {
    const caption = localStorage.getItem("caption");
    const imageUrl = localStorage.getItem("selected-image");
    const videoUrl = localStorage.getItem("selected-video");
    const musicUrl = localStorage.getItem("selected-music");

    if (!messageId && caption && (imageUrl || videoUrl)) {
      saveMessage({ caption, imageUrl, videoUrl, musicUrl }).then((id) => {
        if (id) setMessageId(id);
      });
    }
  }, []);

  useEffect(() => {
    if (!messageId) return;
    const fetchMessage = async () => {
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

  const handleKakaoShare = async () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("Kakao SDK가 초기화되지 않았습니다.");
      return;
    }

    if (!currentUser) {
      alert("로그인이 필요해요 💌");
      router.push("/login");
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
      router.push("/paymentpage");
      return;
    }

    await updateDoc(userRef, { freePassCount: freePass - 1 });

    const previewImage = imageUrl || (videoUrl
      ? "https://ppongtok-app.vercel.app/thumbnail/video-default.jpg"
      : "https://via.placeholder.com/600x400.png?text=PPONGTOK");

    window.Kakao.Link.sendDefault({
    objectType: "feed",
    content: {
      title: "뿅!톡 메시지 도착!",
       description: caption || "나만의 감성 메시지를 확인해보세요!",
       imageUrl: previewImage,
      link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "메시지 보러 가기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
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
    <>
      <Script
  src="https://developers.kakao.com/sdk/js/kakao.min.js"
  strategy="beforeInteractive"
  onLoad={() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
      console.log("✅ Kakao SDK 초기화 완료");
    }
  }}
/>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>📬 공유하기</h2>

        {/* ❌ 미리보기 이미지/영상 제거됨 */}

        {qrUrl && (
          <img src={qrUrl} alt="QR 코드" style={{ width: "150px", margin: "0 auto 16px" }} />
        )}
        <p style={{ fontSize: "14px", color: "#777" }}>이 QR을 스캔하면 누구에게나 마음이 전해져요</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "32px" }}>
          <button onClick={handleKakaoShare}  disabled={!kakaoReady || !messageId} style={buttonStyle("#FAE100")}  >
            💬 카카오톡 공유하기
          </button>
          <button onClick={handleCopy} style={buttonStyle("#cce5ff")}>📎 링크 복사</button>
          {imageUrl && <button onClick={handleImageDownload} style={buttonStyle("#d4edda")}>🖼 이미지 저장</button>}
          {videoUrl && <button onClick={handleVideoDownload} style={buttonStyle("#fce4ec")}>🎥 영상 저장</button>}

          <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, "_blank")}>
            🐦 트위터 공유
          </button>
          <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}>
            📘 페이스북 공유
          </button>
          <button onClick={() => router.push("/")} style={buttonStyle("#eee")}>🏠 처음으로</button>
          <button onClick={() => router.push("/intro")} style={buttonStyle("#f8d7da")}>🚀 시작하기</button>
        </div>
      </div>
    </>
  );
}

function buttonStyle(bg, color = "black") {
  return {
    padding: "4px",
    fontSize: "12px",
    borderRadius: "8px",
    background: bg,
    border: "none",
    fontWeight: "bold",
    color,
  };
}
