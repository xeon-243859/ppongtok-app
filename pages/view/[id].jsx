// pages/view/[id].jsx

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    console.log("🧭 현재 id:", id);

    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("✅ 불러온 메시지:", data);
          setMessageData(data);
        } else {
          console.log("❌ No such document!");
        }
      } catch (error) {
        console.error("🔥 Error fetching message:", error);
      }
    };

    fetchData();
  }, [router.isReady]);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <title>미리보기</title>
      </Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>미리보기</h2>

        <div className={styles["moving-box"]}>
          {messageData.type === "video" && messageData.videoUrl ? (
            <>
              <video
                src={messageData.videoUrl}
                controls
                autoPlay
                className={styles["media-element"]}
                style={{ backgroundColor: "#000" }}
              />
              {messageData.caption && (
                <div className={styles["caption"]}>{messageData.caption}</div>
              )}
            </>
          ) : messageData.type === "image" && Array.isArray(messageData.imageurls) ? (
            <>
              {messageData.imageurls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`이미지 ${index + 1}`}
                  crossOrigin="anonymous"
                  className={styles["media-element"]}
                />
              ))}
              {messageData.caption && (
                <div className={styles["caption"]}>{messageData.caption}</div>
              )}
            </>
          ) : messageData.caption ? (
            <div className={styles["caption"]}>{messageData.caption}</div>
          ) : (
            <p>미디어가 존재하지 않습니다.</p>
          )}
        </div>

        <div className={styles["button-group"]}>
          <button
            className={styles["action-button"]}
            onClick={() => router.back()}
          >
            ⬅ 뒤로가기
          </button>
          <button
            className={styles["action-button"]}
            onClick={() => router.push("/")}
          >
            🏠 처음으로
          </button>
          <button
            className={styles["action-button"]}
            onClick={() => router.push(`/share/${router.query.id}`)}
          >
            📤 공유하기
          </button>
        </div>

        {messageData.music && (
          <audio ref={audioRef} src={messageData.music} autoPlay />
        )}
      </div>
    </>
  );
}
