// pages/view/[id].js (가정한 경로)

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // firebase 경로 확인 필요

// 이 페이지는 PresentPage와 거의 동일한 역할을 합니다.
// 만약 사용하지 않는 페이지라면 삭제해도 무방합니다.
// 여기서는 PresentPage와 동일한 로직으로 수정합니다.
export default function ViewMessagePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 1. 메시지 불러오기
  useEffect(() => {
    if (!id) return;

    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setMessage(docSnap.data());
        } else {
          console.warn("⚠️ 해당 ID의 메시지를 찾을 수 없습니다:", id);
          router.push('/404');
        }
      } catch (error) {
        console.error("❌ 메시지를 불러오는 중 오류 발생:", error);
      }
    };
    fetchMessage();
  }, [id, router]);

  // 2. 이미지 슬라이드 쇼
  useEffect(() => {
    // ❗️ 핵심 수정: message.imageUrls로 접근
    if (message?.type === 'image' && message.imageUrls?.length > 1) {
        const timer = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % message.imageUrls.length);
        }, 3000);
        return () => clearInterval(timer);
    }
  }, [message]);

  // 3. 카카오 SDK 초기화
  useEffect(() => {
    if (document.getElementById('kakao-sdk')) return;
    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
      }
    };
    document.head.appendChild(script);
  }, []);

  // 4. 카카오 공유하기 함수
  const handleKakaoShare = () => {
    if (!window.Kakao?.Share || !id || !message) {
      alert("카카오톡 공유를 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    // ❗️ 핵심 수정: message.imageUrls로 접근
    const imageUrl = message.imageUrls?.[0] || ""; 
    const shareUrl = `${window.location.origin}/present/${id}`; // 최종 도착지는 present 페이지

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지가 도착했어요!",
        description: message.message || "친구에게 온 마음을 확인해보세요.",
        imageUrl: imageUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: "메시지 확인하기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  };

  if (!message) {
    return <p style={{ padding: "20px", textAlign: "center" }}>메시지를 불러오는 중입니다...</p>;
  }

  const { type, videoUrl, imageUrls, message: caption, music } = message;

  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h2>💌 특별한 메시지가 도착했어요</h2>

      {type === "video" && videoUrl && (
        <video src={videoUrl} controls autoPlay loop muted style={{ width: "100%", borderRadius: "12px" }} />
      )}

      {/* 슬라이드 쇼 로직 (fade-in/out) */}
      {type === "image" && Array.isArray(imageUrls) && imageUrls.length > 0 && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: "12px", backgroundColor: "#000" }}>
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`slide-${index}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: currentImageIndex === index ? 1 : 0, transition: "opacity 0.7s ease-in-out" }} />
          ))}
        </div>
      )}

      {caption && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f0f0", borderRadius: "10px", fontSize: "18px", whiteSpace: "pre-wrap", textAlign: "center" }}>{caption}</div>
      )}

      {music && (
        <audio controls autoPlay src={music} style={{ marginTop: "20px", width: "100%" }} />
      )}

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-around" }}>
        <button onClick={() => router.push("/")} style={{padding: '10px 20px'}}>홈으로</button>
        <button onClick={handleKakaoShare} style={{padding: '10px 20px', fontWeight: 'bold'}}>카카오톡으로 공유하기</button>
      </div>
    </div>
  );
}