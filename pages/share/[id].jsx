// pages/share/[id].jsx

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import QRCode from "qrcode.react";

export default function SharePage() {
  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const router = useRouter();
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      const docRef = doc(db, "messages", router.query.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessageData(data);
        if (data.type === "video" && data.videoUrl) {
          setDownloadUrl(data.videoUrl);
        } else if (data.type === "image" && Array.isArray(data.imageurls)) {
          setDownloadUrl(data.imageurls[0]);
        }
      }
    };

    fetchData();
  }, [router.isReady]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  const handleKakaoShare = () => {
    if (window.Kakao && window.Kakao.Share) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init("YOUR_KAKAO_JAVASCRIPT_KEY");
      }

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "메시지를 확인해보세요",
          description: messageData?.caption || "",
          imageUrl:
            messageData?.type === "image"
              ? messageData.imageurls[0]
              : "https://ppongtok-app.vercel.app/logo.png",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      });
    }
  };

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: "1.5rem", textAlign: "center" }}>
      <h2>공유된 메시지</h2>

      <div style={{ marginBottom: "1rem" }}>
        {messageData.type === "video" && messageData.videoUrl ? (
          <>
            <video
              src={messageData.videoUrl}
              controls
              autoPlay
              style={{ width: "100%", maxHeight: "300px" }}
            />
            <div>{messageData.caption}</div>
          </>
        ) : messageData.type === "image" && Array.isArray(messageData.imageurls) ? (
          <>
            {messageData.imageurls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`이미지 ${i + 1}`}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
            ))}
            <div>{messageData.caption}</div>
          </>
        ) : (
          <p>미디어 없음</p>
        )}
      </div>

      {messageData.music && (
        <audio ref={audioRef} src={messageData.music} autoPlay />
      )}

      <div style={{ marginTop: "2rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={handleKakaoShare}>카카오톡 공유</button>
        <button onClick={handleCopyLink}>링크 복사</button>
        <button
          onClick={() =>
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")
          }
        >
          Facebook 공유
        </button>
        <button
          onClick={() =>
            window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank")
          }
        >
          Twitter 공유
        </button>
        {downloadUrl && (
          <a href={downloadUrl} download style={{ textDecoration: "none" }}>
            <button>미디어 저장</button>
          </a>
        )}
        <button onClick={() => router.push("/")}>🏠 처음으로</button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h4>📱 QR 코드로 공유</h4>
        <QRCode value={window.location.href} size={128} />
      </div>
    </div>
  );
}
