import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import html2canvas from "html2canvas";
import QRCode from "qrcode.react";
import styles from "../../src/styles/viewpreview.module.css";

export default function ShareMessagePage() {
  const [messageData, setMessageData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(""); // 🛡 공유링크 useState로 선언
  const router = useRouter();
  const { id } = router.query;
  const previewRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // 🔐 URL 세팅 (브라우저 환경에서만)
  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      setCurrentUrl(`https://ppongtok-app.vercel.app/share/${id}`);
    }
  }, [id]);

  // 🔥 Firebase에서 메시지 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          console.error("❌ 메시지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("🔥 메시지 불러오기 오류:", error);
      }
    };

    fetchData();
  }, [router.isReady, id]);

  // ⏱ 미디어 30초 제한
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videoRef.current) videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
    }, 30000);
    return () => clearTimeout(timeout);
  }, [messageData]);

  // 💾 이미지 저장
  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement("a");
    link.download = `shared-message-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!messageData) return <p>불러오는 중...</p>;

  return (
    <>
      <Head>
        <title>공유 메시지</title>
      </Head>

      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>💌 공유된 메시지</h2>

        <div className={styles["moving-box"]} ref={previewRef}>
          {/* 🎥 영상 */}
          {messageData.type === "video" && messageData.videoUrl ? (
            <video
              ref={videoRef}
              src={messageData.videoUrl}
              controls
              autoPlay
              className={styles["media-element"]}
              style={{ backgroundColor: "#000" }}
            />
          ) : messageData.type === "image" &&
            Array.isArray(messageData.imageurls) &&
            messageData.imageurls.length > 0 ? (
            messageData.imageurls.map((img, index) => (
              <img
                key={index}
                src={img.startsWith("data:image") ? img : `data:image/jpeg;base64,${img}`}
                alt={`img-${index + 1}`}
                className={styles["media-element"]}
              />
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#999", fontStyle: "italic" }}>
              지원되지 않는 미디어 유형입니다.
            </p>
          )}

          {/* 💬 자막 */}
          {messageData.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>
                {messageData.message}
              </div>
            </div>
          )}

          {/* 🎵 음악 */}
          {messageData.music && (
            <audio ref={audioRef} src={messageData.music} autoPlay controls />
          )}
        </div>

        {/* 📤 공유 버튼 */}
        {currentUrl && (
          <div className={styles["button-group"]}>
            <button className={styles["action-button"]} onClick={handleDownloadImage}>
              💾 이미지 저장
            </button>
            <button
              className={styles["action-button"]}
              onClick={() => navigator.clipboard.writeText(currentUrl)}
            >
              🔗 링크 복사
            </button>
            <a
              className={styles["action-button"]}
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📘 페이스북
            </a>
            <a
              className={styles["action-button"]}
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🐦 트위터
            </a>
            <button className={styles["action-button"]} onClick={() => router.push("/")}>
              🏠 처음으로
            </button>
          </div>
        )}

        {/* 📱 QR 코드 */}
        {currentUrl && (
          <div className={styles["qrBox"]}>
            <p>📱 QR코드로 공유하기</p>
            <QRCode value={currentUrl} size={160} />
          </div>
        )}
      </div>
    </>
  );
} 
