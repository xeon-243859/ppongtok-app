// src/pages/ViewMessagePage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ViewMessagePage = () => {
  const { id } = useParams(); // URL에서 messageId 추출
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

  if (!message) {
    return <p style={{ padding: "20px" }}>메시지를 불러오는 중입니다...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>💌 공유된 메시지</h2>

      {message.imageUrl && (
        <img
          src={message.imageUrl}
          alt="공유 이미지"
          style={{
            maxWidth: "100%",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        />
      )}

      {message.caption && (
        <p style={{ fontSize: "18px", marginBottom: "15px" }}>{message.caption}</p>
      )}

      {message.music && (
        <audio controls>
          <source src={message.music} type="audio/mp3" />
          브라우저가 오디오를 지원하지 않습니다.
        </audio>
      )}
    </div>
  );
};

export default ViewMessagePage;
