import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./PreviewPage.css";

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

  const { imageUrl, videoUrl, caption } = messageData;

  return (
    <div className="preview-wrapper">
      <div className="preview-page">
        <div className="media-box">
          <div className="moving-box">
            {videoUrl ? (
              <video
                src={videoUrl}
                autoPlay
                muted
                playsInline
                className="media-display"
                onLoadedMetadata={(e) => {
                  e.target.currentTime = 0;
                  setTimeout(() => e.target.pause(), 30000);
                }}
              />
            ) : (
              <img src={imageUrl} alt="shared" className="media-display" />
            )}
            <div className="scrolling-caption">
              <span>{caption}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMessagePage;
