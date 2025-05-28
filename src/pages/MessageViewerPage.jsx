// src/pages/MessageViewerPage.jsx
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";

const MessageViewerPage = () => {
  const { id } = useParams();
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "messages", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMessageData(docSnap.data());
      } else {
        alert("해당 메시지를 찾을 수 없어요 😢");
      }
    };
    fetchData();
  }, [id]);

  if (!messageData) {
    return <p>💬 메시지를 불러오는 중입니다...</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>💌 도착한 마음</h2>
      <img
        src={messageData.imageUrl}
        alt="메시지 이미지"
        style={{ maxWidth: "100%", borderRadius: "16px" }}
      />
      <p style={{ marginTop: "20px", fontSize: "18px" }}>{messageData.caption}</p>
    </div>
  );
};

export default MessageViewerPage;
