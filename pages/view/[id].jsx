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
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          console.log("❌ No such document!");
        }
      } catch (error) {
        console.error("🔥 Error fetching message:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <title>미리보기</title>
      </Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>미리보기</h2>

        <div className={styles["moving-box"]}>
          {messageData.mediaType === "video" ? (
            <video src={messageData.media} controls className={styles["media-element"]} />
          ) : (
            <img src={messageData.media} alt="미리보기" className={styles["media-element"]} />
          )}
        </div>

        <div className={styles["button-group"]}>
          <button className={styles["action-button"]} onClick={() => router.back()}>
            ⬅ 뒤로가기
          </button>
          <button className={styles["action-button"]} onClick={() => router.push("/")}>
            🏠 처음으로
          </button>
          <button className={styles["action-button"]} onClick={() => router.push(`/share/${id}`)}>
            📤 공유하기
          </button>
        </div>

        <audio ref={audioRef} src={messageData.music} autoPlay />
      </div>
    </>
  );
}
