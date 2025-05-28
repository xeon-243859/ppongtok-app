import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function ViewMessagePage() {
  const { id } = useParams();
  const db = getFirestore();
  const [messageData, setMessageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          alert("공유할 메시지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("메시지 불러오기 오류:", error);
        alert("메시지를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (!messageData) return <p>메시지를 표시할 수 없습니다.</p>;

  return (
    <div className="view-message-page">
      {messageData.videoUrl ? (
        <video
          src={messageData.videoUrl}
          controls
          autoPlay
          className="media-display"
        />
      ) : (
        <img
          src={messageData.imageUrl}
          alt="shared"
          className="media-display"
        />
      )}
      <p className="caption">{messageData.caption}</p>
    </div>
  );
}

export default ViewMessagePage;
