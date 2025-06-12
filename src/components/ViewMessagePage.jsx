// ✅ ViewMessagePage.jsx with Kakao Share 기능 통합 완료

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ViewMessagePage({ message }) {
  const router = useRouter();
  const { id } = router.query;
  const [localMessage, setLocalMessage] = useState(message || null);

  // ✅ Firebase 메시지 불러오기 (필요 시)
  useEffect(() => {
    if (!id || localMessage) return;
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLocalMessage(docSnap.data());
          console.log("🔥 전체 message 객체:", docSnap.data());
        } else {
          console.warn("⚠️ No such document!");
        }
      } catch (error) {
        console.error("❌ 메시지 불러오기 실패:", error);
      }
    };
    fetchMessage();
  }, [id, localMessage]);

  // ✅ Kakao SDK 로드 및 초기화
  useEffect(() => {
    const loadKakaoSdk = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("kakao-sdk")) return resolve();
        const script = document.createElement("script");
        script.id = "kakao-sdk";
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadKakaoSdk().then(() => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
        console.log("✅ Kakao SDK 초기화 완료");
      }
    });
  }, []);

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.Share) {
      alert("카카오톡 공유를 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const imageUrl =
      localMessage?.type === "video"
        ? localMessage?.videoUrl
        : Array.isArray(localMessage?.imageUrls)
        ? localMessage.imageUrls[0]
        : "";

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지",
        description: localMessage.caption || "보낸 사람의 메시지를 확인해보세요!",
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    });
  };

  if (!localMessage) {
    return <p style={{ padding: "20px" }}>메시지를 불러오는 중입니다...</p>;
  }

  const { type, videoUrl, imageUrls, caption, music } = localMessage;

  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h2>💌 공유된 메시지</h2>

      {type === "video" && videoUrl && (
        <video
          src={videoUrl}
          controls
          style={{ width: "100%", marginBottom: "20px", borderRadius: "12px" }}
        />
      )}

      {type === "image" && Array.isArray(imageUrls) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`image-${idx}`}
              style={{ width: "45%", borderRadius: "8px", objectFit: "cover" }}
            />
          ))}
        </div>
      )}

      {caption && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px 16px",
            backgroundColor: "#ffeef2",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {caption}
        </div>
      )}

      {music && <audio controls src={music} style={{ marginTop: "24px", width: "100%" }} />}

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => router.back()}>뒤로가기</button>
        <button onClick={handleKakaoShare}>카카오톡으로 공유하기</button>
      </div>
    </div>
  );
}





