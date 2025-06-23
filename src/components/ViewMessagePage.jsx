import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ViewMessagePage({ message }) {
  const router = useRouter();
  const { id } = router.query;
  const [localMessage, setLocalMessage] = useState(message || null);
  
  // ✨ 수정된 부분 1: 이미지 슬라이드 쇼를 위한 state 추가
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ Firebase 메시지 불러오기 (기존과 동일)
  useEffect(() => {
    if (!id || localMessage) return;
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLocalMessage(docSnap.data());
          // F12 개발자 도구에서 이미지 URL이 잘 들어왔는지 확인해보세요!
          console.log("🔥 Firestore에서 불러온 데이터:", docSnap.data()); 
        } else {
          console.warn("⚠️ No such document!");
        }
      } catch (error) {
        console.error("❌ 메시지 불러오기 실패:", error);
      }
    };
    fetchMessage();
  }, [id, localMessage]);

  // ✨ 수정된 부분 2: 이미지 슬라이드 쇼를 위한 useEffect 추가
  useEffect(() => {
    // 메시지 데이터가 있고, 타입이 이미지이며, 이미지가 2장 이상일 때만 작동
    if (localMessage?.type === 'image' && localMessage.imageUrls?.length > 1) {
        const timer = setInterval(() => {
            // 현재 이미지 인덱스를 (다음 인덱스 % 전체 이미지 개수) 로 바꿔서 순환시킴
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % localMessage.imageUrls.length);
        }, 3000); // 3초마다 이미지 변경

        // 페이지를 벗어날 때 타이머를 정리해서 메모리 누수를 방지
        return () => clearInterval(timer);
    }
  }, [localMessage]); // localMessage 데이터가 로드되면 이 효과가 실행됩니다.

  // ✅ Kakao SDK 초기화 (기존과 동일)
  useEffect(() => {
    const loadKakaoSdk = () => {
      // ... 카카오 SDK 초기화 코드는 그대로 ...
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

  // ✅ 카카오 공유하기 함수 (기존과 동일)
  const handleKakaoShare = () => {
    // ... 카카오 공유하기 코드는 그대로 ...
    if (!window.Kakao || !window.Kakao.Share || !id || !localMessage) {
      alert("카카오톡 공유를 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    const imageUrl =
      localMessage?.type === "video"
        ? localMessage?.videoUrl
        : Array.isArray(localMessage?.imageUrls)
        ? localMessage.imageUrls[0]
        : "";
    const shareUrl = `https://us-central1-ppongtok-project.cloudfunctions.net/ogMeta/${id}`;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지",
        description: localMessage.caption || "보낸 사람의 메시지를 확인해보세요!",
        imageUrl: imageUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: "메시지 보러가기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
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
        <video src={videoUrl} controls style={{ width: "100%", marginBottom: "20px", borderRadius: "12px" }} />
      )}

      {/* ✨ 수정된 부분 3: 이미지 표시 로직을 슬라이드 쇼 형태로 완전히 교체 */}
      {type === "image" && Array.isArray(imageUrls) && imageUrls.length > 0 && (
        <div
          style={{
            position: "relative", // 내부 이미지들의 기준점이 됨
            width: "100%",
            aspectRatio: "1 / 1", // 1:1 정사각형 비율, 원하면 "16 / 9" 등으로 변경 가능
            overflow: "hidden",   // 영역 밖으로 나가는 이미지는 잘라냄
            borderRadius: "12px",
            backgroundColor: "#000" // 이미지가 로드되기 전 검은 배경
          }}
        >
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`slide-image-${index}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover", // 이미지가 찌그러지지 않고 꽉 차게
                // 현재 보여줘야 할 이미지(currentImageIndex)만 불투명하게(opacity: 1), 나머지는 투명하게(opacity: 0) 만듦
                opacity: currentImageIndex === index ? 1 : 0,
                transition: "opacity 0.7s ease-in-out", // 0.7초 동안 부드럽게 나타나는 효과
              }}
            />
          ))}
        </div>
      )}

      {/* 아래 부분은 기존과 동일 */}
      {caption && (
        <div style={{ marginTop: "10px", padding: "10px 16px", backgroundColor: "#ffeef2", borderRadius: "10px", fontSize: "18px", fontWeight: "500", textAlign: "center" }}>
          {caption}
        </div>
      )}

      {music && (
        <audio controls autoPlay src={music} style={{ marginTop: "24px", width: "100%" }} />
      )}

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => router.back()}>뒤로가기</button>
        <button onClick={handleKakaoShare}>카카오톡으로 공유하기</button>
      </div>
    </div>
  );
}