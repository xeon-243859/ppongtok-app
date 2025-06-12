import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dynamic from "next/dynamic";

const ViewMessagePage = dynamic(() => import("../../src/components/ViewMessagePage"), {
  ssr: false,
});

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessage(docSnap.data());
          console.log("✅ 불러온 message:", docSnap.data());
        } else {
          console.warn("⚠️ 문서가 없습니다.");
        }
      } catch (err) {
        console.error("❌ 메시지 불러오기 실패:", err);
      }
    };

    fetchMessage();
  }, [id]);

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
        console.log("✅ Kakao SDK initialized");
      }
    });
  }, []);

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.Share || !message) return;

    const imageUrl =
      message.type === "video"
        ? message.videoUrl
        : Array.isArray(message.imageUrls)
        ? message.imageUrls[0]
        : "";

    const shareUrl = `https://us-central1-ppongtok-project.cloudfunctions.net/ogMeta/${id}`;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "누군가 당신에게 메시지를 보냈어요!",
        description: message.caption,
        imageUrl: imageUrl || "https://via.placeholder.com/600x400?text=메시지",
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
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        메시지를 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🎉 공유 전용 페이지</h2>
      <p>{message.caption}</p>

      {message.type === "video" ? (
        <video
          src={message.videoUrl}
          controls
          style={{ maxWidth: "100%", margin: "20px 0", borderRadius: "12px" }}
        />
      ) : (
        <img
          src={Array.isArray(message.imageUrls) ? message.imageUrls[0] : ""}
          alt="미리보기 이미지"
          style={{ maxWidth: "100%", borderRadius: "16px", margin: "20px 0" }}
        />
      )}

      <button
        onClick={handleKakaoShare}
        style={{
          fontSize: "1.2rem",
          padding: "0.6rem 1.4rem",
          backgroundColor: "#FEE500",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        카카오톡으로 공유하기
      </button>
    </div>
  );
}
