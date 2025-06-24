import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Head from "next/head";
import styles from "./sharepage.module.css";

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchMessage = async () => {
        try {
          const docRef = doc(db, "messages", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMessage(docSnap.data());
          } else {
            console.log("문서가 존재하지 않습니다.");
          }
        } catch (error) {
          console.error("문서 불러오기 오류:", error);
        }
      };
      fetchMessage();
    }
  }, [id]);

  useEffect(() => {
    if (message?.type === "image" && message.imageUrls?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          (prev + 1) % message.imageUrls.length
        );
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [message]);

  return (
    <>
      <Head>
        <title>{message?.caption || "뿅!톡으로 특별한 메시지가 도착했어요"}</title>
        <meta
          property="og:title"
          content={message?.caption || "뿅!톡으로 특별한 메시지가 도착했어요"}
        />
        <meta
          property="og:description"
          content={message?.musicTitle || "배경 음악과 함께 감상해보세요!"}
        />
        <meta
          property="og:image"
          content={
            message?.type === "image"
              ? message.imageUrls?.[0]
              : message?.thumbnailUrl || "/icons/104.png"
          }
        />
      </Head>
      <div className={styles["share-container"]}>
        <h2 className={styles["share-title"]}>✨ 친구가 보낸 메시지 도착!</h2>
        <div className={styles["media-box"]}>
          {message?.type === "video" && message.videoUrl && (
            <video
              src={message.videoUrl}
              controls
              autoPlay
              loop
              muted
              className={styles["media-element"]}
            />
          )}
          {message?.type === "image" && message.imageUrls?.length > 0 && (
            <img
              src={message.imageUrls[currentImageIndex]}
              alt={`slide-${currentImageIndex}`}
              className={styles["media-element"]}
            />
          )}
          {message?.caption && (
            <div className={styles["caption-box"]}>{message.caption}</div>
          )}
        </div>
        {message?.music && (
          <audio
            src={message.music}
            controls
            autoPlay
            className={styles["audio-player"]}
          />
        )}
        <div className={styles["icon-row"]}>
          <img src="/icons/2.png" alt="icon2" />
          <img src="/icons/104.png" alt="icon104" />
          <img src="/icons/105.png" alt="icon105" />
          <img src="/icons/106.png" alt="icon106" />
          <img src="/icons/more.png" alt="iconMore" />
        </div>
      </div>
    </>
  );
}
