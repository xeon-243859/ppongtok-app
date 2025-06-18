import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import { QRCode } from "react-qr-code"; // ✅ 'react-qr-code'에서 import
import styles from "../../src/styles/viewpreview.module.css";
// dynamic import는 잠시 보류하고, 기본 import로 먼저 테스트합니다.

export default function ShareMessagePage() {
  const [messageData, setMessageData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const previewRef = useRef(null);
  // ... (videoRef, audioRef 등 필요한 ref들)

  // 공유 링크 생성
  useEffect(() => {
    // Hydration 오류를 피하기 위해, router.isReady 이후에 URL을 설정합니다.
    if (router.isReady && id) {
      setCurrentUrl(`${window.location.origin}/share/${id}`);
    }
  }, [router.isReady, id]);

  // 메시지 데이터 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;
    const fetchData = async () => {
      // ... (기존 fetchData 로직)
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

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    // html2canvas는 필요할 때만 불러오기 (성능에 유리)
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement("a");
    link.download = `shared-message-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!messageData) return <p>불러오는 중...</p>;

  // ... (mediaContent 렌더링 변수 로직은 기존대로)

  return (
    <>
      <Head>
        <title>공유 메시지</title>
      </Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>💌 공유된 메시지</h2>
        <div className={styles["moving-box"]} ref={previewRef}>
          {/* 미디어, 자막 등 */}
        </div>
        {/* 음악 플레이어 등 */}
        
        {/* 공유 버튼 그룹 */}
        {currentUrl && (
          <div className={styles["button-group"]}>
            {/* 버튼들... */}
          </div>
        )}
        
        {/* QR 코드 */}
        {currentUrl && (
          <div className={styles["qrBox"]}>
            <p>📱 QR코드로 공유하기</p>
            {/* ✅ 흰색 배경을 추가하면 QR 인식이 더 잘 됩니다. */}
            <div style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
              <QRCode value={currentUrl} size={160} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}