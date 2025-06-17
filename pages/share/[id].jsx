import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import styles from "../../src/styles/sharepage.module.css";

export default function ShareMessagePage() {
  const [messageData, setMessageData] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const previewRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMessageData(data);
        } else {
          console.error("❌ 메시지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("🔥 메시지 불러오기 오류:", error);
      }
    };

    fetchData();
  }, [router.isReady, id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }, 30000); // 30초 제한

    return () => clearTimeout(timeout);
  }, [messageData]);

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement("a");
    link.download = `message-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const currentUrl = `https://ppongtok-app.vercel.app/share/${id}`;

  if (!messageData) return <p>불러오는 중...</p>;

  return (
    <>
      <Head>
        <title>공유하기</title>
      </Head>
      <div className={styles.container}>
        <h2 className={styles.title}>💌 공유 메시지</h2>

        <div ref={previewRef} className={styles.previewBox}>
          {messageData.type === "video" && messageData.videoUrl ? (
            <video
              ref={videoRef}
              src={messageData.videoUrl}
              controls
              className={styles.media}
            />
          ) : (
            <>
              {messageData.type === "image" &&
                Array.isArray(messageData.imageurls) &&
                messageData.imageurls.map((url, index) => {
                  if (!url || typeof url !== "string") return null;
                  const safeUrl = url.startsWith("data:image")
                    ? url
                    : `data:image/jpeg;base64,${url}`;
                  return (
                    <img
                      key={index}
                      src={safeUrl}
                      alt={`이미지 ${index + 1}`}
                      className={styles.media}
                    />
                  );
                })}

              {typeof messageData.message === "string" && (
                <div className={styles.caption}>{messageData.message}</div>
              )}
            </>
          )}

          {/* 🎵 음악 제거 or 숨김 처리하고 싶으면 아래 주석 해제 */}
          {/* 
          {messageData.music && (
            <audio
              ref={audioRef}
              src={messageData.music}
              autoPlay
              style={{ display: "none" }}
            />
          )} 
          */}
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.button}
            onClick={() => navigator.clipboard.writeText(currentUrl)}
          >
            🔗 링크 복사
          </button>
          <button className={styles.button} onClick={handleDownloadImage}>
            💾 이미지 저장
          </button>
          <a
            className={styles.button}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📘 페이스북
          </a>
          <a
            className={styles.button}
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🐦 트위터
          </a>
          <button className={styles.button} onClick={() => router.push("/")}>
            🏠 처음으로
          </button>
        </div>

        {typeof currentUrl === "string" && currentUrl.length > 0 && (
          <div className={styles.qrBox}>
            <p>📱 QR코드로 공유하기</p>
            <QRCode value={currentUrl} size={160} />
          </div>
        )}
      </div>
    </>
  );
}
