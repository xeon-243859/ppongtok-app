import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ViewMessagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessage(docSnap.data());
        } else {
          console.log("❌ 해당 메시지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("🔥 메시지 불러오기 실패:", error);
      }
    };
    fetchMessage();
  }, [id]);
   useEffect(() => {
   if (message) {
    console.log("🔥 전체 message 객체", message);
    console.log("🖼️ imageUrls", message.imageUrls);
    console.log("🎞️ videoUrl", message.videoUrl);
    console.log("📝 caption", message.caption);
    console.log("🎵 music", message.music);
  }
}, [message]);
 if (!message) return <p style={{ padding: "20px" }}>메시지를 불러오는 중입니다...</p>;

return (
  <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
    <h2>💌 공유된 메시지</h2>

    {/* 영상 우선 렌더링 */}
    {message.videoUrl && (
      <video
        src={message.videoUrl}
        controls
        style={{
          width: "90%",
          maxWidth: "600px",
          borderRadius: 16,
          margin: "20px auto",
          display: "block",
        }}
      />
    )}

    {/* 영상이 없을 때만 이미지 배열 렌더링 */}
    {!message.videoUrl && message.imageUrls?.length > 0 &&
      message.imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`공유 이미지 ${index + 1}`}
          style={{
            width: "90%",
            maxWidth: "600px",
            borderRadius: 16,
            margin: "20px auto",
            display: "block",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
      ))}

    {/* 자막 */}
    {message.caption && (
      <p style={{
        fontSize: 18,
        marginBottom: 15,
        textAlign: "center",
        whiteSpace: "pre-wrap",
      }}>
        {message.caption}
      </p>
    )}

    {/* 음악 */}
    {message.music && (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <audio controls src={message.music}>
          브라우저가 오디오를 지원하지 않습니다.
        </audio>
      </div>
    )}

    {/* 버튼 */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        marginTop: 30,
        flexWrap: "wrap",
      }}
    >
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <button onClick={() => navigate(`/share/${id}`)}>다음 - 공유하기</button>
      <button onClick={() => navigate("/")}>처음으로</button>
    </div>
  </div>
);

};

export default ViewMessagePage;
