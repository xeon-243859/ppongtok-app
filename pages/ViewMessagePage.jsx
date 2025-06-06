import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/firebase";

const ViewMessagePage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const docRef = doc(db, "messages", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMessage(docSnap.data());
        console.log("🔥 전체 message 객체:", docSnap.data());
      } else {
        console.log("No such document!");
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

      {/* 🎥 영상 렌더링 */}
      {message.type === "video" && message.videoUrl && (
        <video
          src={message.videoUrl}
          controls
          style={{ width: "100%", marginBottom: "20px", borderRadius: "12px" }}
        />
      )}

      {/* 🖼 이미지 4장 렌더링 */}
      {message.type === "image" && Array.isArray(message.imageUrls) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {message.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`image-${index}`}
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
      {message.caption && (
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
          {message.caption}
        </div>
      )}

      {/* 🎵 음악 */}
      {message.music && (
        <audio
          controls
          src={message.music}
          style={{ marginTop: "24px", width: "100%" }}
        />
      )}

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => window.history.back()}>뒤로가기</button>
      </div>
    </div>
  );
};

export default ViewMessagePage;


