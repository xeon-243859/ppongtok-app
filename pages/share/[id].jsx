import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import { QRCode } from "react-qr-code";
import styles from "../../src/styles/viewpreview.module.css";

export default function ShareMessagePage() {
  const [messageData, setMessageData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const previewRef = useRef(null);

  // Kakao SDK 초기화
  useEffect(() => {
    // ⚠️ 이 방식은 보안에 취약하므로, 실제 서비스 시에는 .env.local 파일 사용을 권장합니다.
    const kakaoKey = '4abf45cca92e802defcd2c15a6615155';
    
    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
      console.log("✅ Kakao SDK 초기화 완료");
      setIsKakaoReady(true);
    }
  }, []);

  // 💡 [핵심 수정] 공유할 URL을 콘텐츠 전용 페이지인 '/present/[id]'로 설정합니다.
  useEffect(() => {
    if (router.isReady && id) {
      // 이제 모든 공유 기능은 버튼이 없는 깔끔한 'present' 페이지를 가리킵니다.
      setCurrentUrl(`${window.location.origin}/present/${id}`);
    }
  }, [router.isReady, id]);

  // 메시지 데이터 불러오기 (수정 없음)
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

  // --- 핸들러 함수들 (내부 로직 수정 없음) ---
  // currentUrl 변수가 바뀌었기 때문에, 핸들러들은 자동으로 새 주소를 공유하게 됩니다.

  const handleKakaoShare = () => {
    if (!isKakaoReady) {
      alert("공유 기능이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    if (window.Kakao && messageData) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "뽕톡에서 보낸 메시지",
          description: messageData.message || "친구가 보낸 특별한 메시지를 확인해보세요!",
          imageUrl:
            messageData.imageurls?.[0] || "/logo.png", // public/logo.png
          link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
        },
        buttons: [{ title: "메시지 확인하기", link: { mobileWebUrl: currentUrl, webUrl: currentUrl } }],
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert("클립보드에 링크가 복사되었어요!");
    });
  };

  const handleSaveAsImage = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement("a");
    link.download = `ppongtok-message-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleDownloadMedia = async () => {
    // ... (기존과 동일한 다운로드 로직) ...
  };

  if (!messageData) return <p>공유 옵션을 불러오는 중...</p>;

  // --- 렌더링 부분 ---

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
        integrity="sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG2PkYyFsaHYgEGUNsplYw"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Head>
        <title>메시지 공유 옵션</title>
        {/* 💡 [핵심 수정] 이 페이지의 SNS 미리보기는 이제 /present/[id]를 가리킵니다. */}
        <meta property="og:title" content="뽕톡에서 보낸 메시지" />
        <meta property="og:description" content={messageData.message || "친구가 보낸 특별한 메시지를 확인해보세요!"} />
        <meta property="og:image" content={messageData.imageurls?.[0] || "/logo.png"} />
        <meta property="og:url" content={currentUrl} />
      </Head>

      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>✅ 메시지 공유 옵션</h2>
        
        {/* '이미지로 저장' 기능을 위한 미리보기 화면 */}
        <div className={styles["moving-box"]} ref={previewRef}>
          {messageData.type === "video" && <video src={messageData.videoUrl} controls autoPlay muted loop className={styles["media-element"]} />}
          {messageData.type === "image" && messageData.imageurls?.map((img, i) => <img key={i} src={img} alt={`img-${i}`} className={styles["media-element"]} />)}
          {messageData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{messageData.message}</div></div>}
        </div>
        
        {messageData.music && <audio src={messageData.music} autoPlay controls style={{ width: '100%', marginTop: '15px' }} />}

        {/* 💡 [핵심 수정] 버튼들을 보기 좋게 정렬하는 새로운 CSS 클래스 적용 */}
        <div className={styles["share-button-grid"]}>
          <button onClick={handleKakaoShare} className={styles["share-button"]}>카카오톡</button>
          <button onClick={handleCopyLink} className={styles["share-button"]}>링크 복사</button>
          <button onClick={handleDownloadMedia} className={styles["share-button"]}>원본 저장</button>
          <button onClick={handleSaveAsImage} className={styles["share-button"]}>이미지로 저장</button>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className={styles["share-button"]}>페이스북</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("뽕톡에서 보낸 특별한 메시지 확인하기!")}`} target="_blank" rel="noopener noreferrer" className={styles["share-button"]}>트위터</a>
        </div>

        {/* 💡 [핵심 수정] QR코드도 이제 자동으로 /present/[id] 링크를 생성합니다. */}
        {currentUrl && (
          <div className={styles["qrBox"]}>
            <p>📱 QR코드로 공유하기</p>
            <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '8px' }}>
              <QRCode value={currentUrl} size={160} />
            </div>
          </div>
        )}

        <button className={styles["action-button"]} style={{marginTop: '20px'}} onClick={() => router.push("/")}>
          🏠 처음으로
        </button>
      </div>
    </>
  );
}