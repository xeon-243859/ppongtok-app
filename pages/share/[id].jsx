// pages/share/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return; // ✅ 추가된 부분
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessage(docSnap.data());
        }
      } catch (err) {
        console.error("❌ 메시지 불러오기 실패:", err);
      }
    };
    fetchMessage();
  }, [router.isReady, id]); // ✅ 의존성 배열도 수정

  useEffect(() => {
    const loadKakaoSdk = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("kakao-sdk")) return resolve();
        const script = document.createElement("script");
        script.id = "kakao-sdk";
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    loadKakaoSdk().then(() => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
      }
    });
  }, []);

  const handleKakaoShare = () => {
      console.log("📣 공유 버튼 클릭됨"); // ✅추가
    if (!window.Kakao || !window.Kakao.Share || !message) {
    console.warn("⚠️ 공유 불가 - 조건 미충족", {
      Kakao: !!window.Kakao,
      Share: !!window.Kakao?.Share,
      messageLoaded: !!message,
    });
    return;
  }

    const shareUrl = `https://ppongtok-app.vercel.app/api/ogmeta/${id}`;
    const imageUrl = message.thumbnailUrl || "https://via.placeholder.com/600x400?text=미리보기";

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "누군가 당신에게 메시지를 보냈어요!",
        description: message.caption,
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "메시지 보러가기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  if (!message) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>메시지를 불러오는 중...</div>;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🎉 공유 전용 페이지</h2>
      <p>{message.caption}</p>

      {message.type === "video" ? (
        <video src={message.videoUrl} controls style={{ maxWidth: "100%" }} />
      ) : (
        <img
          src={Array.isArray(message.imageUrls) ? message.imageUrls[0] : ""}
          alt="미리보기"
          style={{ maxWidth: "100%", borderRadius: "12px" }}
        />
      )}

      <button type="button" onClick={handleKakaoShare}>
        style={{
          marginTop: "1.5rem",
          fontSize: "1.2rem",
          backgroundColor: "#FEE500",
          padding: "0.7rem 1.5rem",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      
        카카오톡으로 공유하기
      </button>
    </div>
  );
}
