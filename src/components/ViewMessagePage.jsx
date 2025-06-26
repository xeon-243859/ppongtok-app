import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ViewMessagePage({ message }) {
  const router = useRouter();
  const { id } = router.query;
  const [localMessage, setLocalMessage] = useState(message || null);
  
  // ✨ 제가 수정한 부분 1: 이미지 슬라이드를 위한 state 추가
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✨ 제가 수정한 부분 2: Firebase 메시지 불러오는 useEffect (완벽 수정본)
 useEffect(() => {
    if (!id || localMessage) return;

    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
         console.log("✅ Firestore 저장 성공");
        if (docSnap.exists()) {
          const messageData = docSnap.data();
          
          // 👇 이 부분이 핵심입니다!
          console.log(
            "🔥🔥🔥 이미지 주소 확인!! 🔥🔥🔥", 
            JSON.stringify(messageData, null, 2)
          );

          setLocalMessage(messageData);

        } else {
          console.warn("⚠️ 해당 ID의 메시지를 찾을 수 없습니다:", id);
        }
      } catch (error) {
        console.error("❌ 메시지를 불러오는 중 오류 발생:", error);
        console.error("❌ Firestore 저장 실패", e);
      }
    };

    fetchMessage();
  }, [id, localMessage]);

  // ✨ 제가 수정한 부분 3: 이미지 슬라이드 쇼를 위한 useEffect 추가
  useEffect(() => {
    if (localMessage?.type === 'image' && localMessage.imageUrls?.length > 1) {
        const timer = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % localMessage.imageUrls.length);
        }, 3000);
        return () => clearInterval(timer);
    }
  }, [localMessage]);

  // ✅ Kakao SDK 초기화 (기존 코드와 동일)
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
      }
    });
  }, []);

  // ✅ 카카오 공유하기 함수 (기존 코드와 동일)
  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.Share || !id || !localMessage) {
      alert("카카오톡 공유를 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    const imageUrl = localMessage?.imageUrls?.[0] || ""; // 첫 번째 이미지를 공유 썸네일로 사용
    const shareUrl = `https://ppongtok-app.vercel.app/share/${id}`; // 배포된 주소로 변경

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지가 도착했어요!",
        description: localMessage.message || "친구에게 온 마음을 확인해보세요.",
        imageUrl: imageUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: "메시지 확인하기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  };

  if (!localMessage) {
    return <p style={{ padding: "20px", textAlign: "center" }}>메시지를 불러오는 중입니다...</p>;
  }

  const { type, videoUrl, imageUrls, message: caption, music } = localMessage; // message를 caption으로 받음

  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h2>💌 특별한 메시지가 도착했어요</h2>

      {type === "video" && videoUrl && (
        <video src={videoUrl} controls autoPlay loop muted style={{ width: "100%", borderRadius: "12px" }} />
      )}

      {/* ✨ 제가 수정한 부분 4: 이미지 표시 로직을 슬라이드 쇼 형태로 교체 */}
      {type === "image" && Array.isArray(imageUrls) && imageUrls.length > 0 && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: "12px", backgroundColor: "#000" }}>
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`slide-${index}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: currentImageIndex === index ? 1 : 0, transition: "opacity 0.7s ease-in-out" }} />
          ))}
        </div>
      )}

      {caption && (
        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f0f0", borderRadius: "10px", fontSize: "18px", whiteSpace: "pre-wrap", textAlign: "center" }}>
          {caption}
        </div>
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

