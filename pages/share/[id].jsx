  import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
// import html2canvas from "html2canvas"; // 👈 dynamic import를 위해 주석 처리 또는 삭제
// import QRCode from "qrcode.react"; // 👈 dynamic import를 위해 주석 처리 또는 삭제
import styles from "../../src/styles/viewpreview.module.css";
import dynamic from 'next/dynamic'; // 👈 next/dynamic을 import

// 👇 QRCode 컴포넌트를 dynamic import로 불러옵니다. (SSR 비활성화)
const QRCode = dynamic(() => import('qrcode.react'), { ssr: false });

export default function ShareMessagePage() {
  const [messageData, setMessageData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const previewRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // ... (useEffect 로직들은 그대로 유지) ...

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;

    // 👇 html2canvas도 사용할 때만 dynamic하게 import 합니다.
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement("a");
    link.download = `shared-message-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };


  if (!messageData) return <p>불러오는 중...</p>;
 

  // ✅ 미디어 렌더링 변수로 분기 처리
  let mediaContent = (
    <p style={{ color: "#888", textAlign: "center" }}>
      지원되지 않는 미디어 유형입니다.
    </p>
  );

  if (messageData.type === "video" && messageData.videoUrl) {
    mediaContent = (
      <video
        ref={videoRef}
        src={messageData.videoUrl}
        controls
        autoPlay
        className={styles["media-element"]}
        style={{ backgroundColor: "#000" }}
      />
    );
  } else if (
    messageData.type === "image" &&
    Array.isArray(messageData.imageurls) &&
    messageData.imageurls.length > 0
  ) {
    mediaContent = messageData.imageurls.map((img, index) => (
      <img
        key={index}
        src={
          img.startsWith("data:image") || img.startsWith("http") || img.startsWith("/")
            ? img
            : `data:image/jpeg;base64,${img}`
        }
        alt={`img-${index + 1}`}
        className={styles["media-element"]}
      />
    ));
  }

  return (
 <> 
<Head> 
<title>공유 메시지</title> 
</Head>
  {/* console.log가 있던 자리가 깨끗해졌습니다. */}
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>💌 공유된 메시지</h2>
  <div className={styles["moving-box"]} ref={previewRef}>
          {/* ✅ 미디어 */}
          {mediaContent}

          {/* 💬 자막 */}
          {messageData.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>
                {messageData.message}
              </div>
            </div>
          )}
        </div>
         {/* 🎵 음악 (위치를 moving-box 바깥으로 옮기는 것을 권장합니다) */}
        {messageData.music && (
          <audio
            ref={audioRef}
            src={messageData.music}
            autoPlay
            controls
            style={{ marginTop: '20px', width: '100%' }} // 스타일 추가
          />
        )}
          {/* 📤 공유 버튼 */}
        {currentUrl && (
          <div className={styles["button-group"]}>
            <button className={styles["action-button"]} onClick={handleDownloadImage}>
              💾 이미지 저장
            </button>
            <button
              className={styles["action-button"]}
              onClick={() => {
                navigator.clipboard.writeText(currentUrl);
                alert('클립보드에 링크가 복사되었어요!'); // 사용자 피드백 추가
              }}
            >
             🔗 링크 복사
            </button>
            {/* ... 나머지 버튼들 ... */}
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
            

