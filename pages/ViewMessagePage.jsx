import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // ✅ react-router-dom → next/router
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/firebase"; 

export default function ViewMessagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!id) return; // id가 아직 준비되지 않았을 수 있음 (CSR 상황)
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessage(docSnap.data());
          console.log("🔥 전체 message 객체:", docSnap.data());
        } else {
          console.warn("⚠️ No such document!");
        }
      } catch (error) {
        console.error("❌ 메시지 불러오기 실패:", error);
      }
    };
    fetchMessage();
  }, [id]);

  if (!message) {
    return <p style={{ padding: "20px" }}>메시지를 불러오는 중입니다...</p>;
  }

  const { type, videoUrl, imageUrls, caption, music } = message;

  return (
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <h2>💌 공유된 메시지</h2>

      {/* 🎥 영상 */}
      {type === "video" && videoUrl && (
        <video
          src={videoUrl}
          controls
          style={{
            width: "100%",
            marginBottom: "20px",
            borderRadius: "12px",
          }}
        />
      )}

      {/* 🖼 이미지 */}
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
              style={{
                width: "45%",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      )}

      {/* 📝 자막 */}
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

      {/* 🎵 음악 */}
      {music && (
        <audio
          controls
          src={music}
          style={{ marginTop: "24px", width: "100%" }}
        />
      )}

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => router.back()}>뒤로가기</button>
      </div>
    </div>
  );
}
