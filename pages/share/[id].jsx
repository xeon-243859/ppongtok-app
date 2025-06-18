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

  // ✅ Kakao SDK 초기화 (올바르고 안전한 최종 버전)
  useEffect(() => {
    // 1. .env.local 파일에서 키를 안전하게 읽어옵니다.
     const kakaoKey = '4abf45cca92e802defcd2c15a6615155';
       
    // 2. 키가 존재하고, Kakao SDK가 로드되었을 때만 초기화를 진행합니다.
    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
      console.log("✅ Kakao SDK 초기화 완료");
      setIsKakaoReady(true);
    }
  }, []);

  // 공유 링크 생성
  useEffect(() => {
    if (router.isReady && id) {
      setCurrentUrl(`${window.location.origin}/share/${id}`);
    }
  }, [router.isReady, id]);

  // 메시지 데이터 불러오기
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

  // --- 핸들러 함수들 ---

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
            messageData.imageurls?.[0] ||
            "https://ppongtok-app.vercel.app/logo.png",
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
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
    if (!messageData) return;
    let url, filename;
    if (messageData.type === 'video' && messageData.videoUrl) {
      url = messageData.videoUrl;
      filename = `ppongtok-video-${id}.mp4`;
    } else if (messageData.type === 'image' && messageData.imageurls?.[0]) {
      url = messageData.imageurls[0];
      filename = `ppongtok-image-${id}.jpg`;
    } else {
      alert('저장할 영상이나 이미지가 없습니다.');
      return;
    }
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("🔥 파일 다운로드 오류:", error);
      alert("파일을 다운로드하는 데 실패했습니다. 직접 링크를 열어 저장해주세요.");
      window.open(url, '_blank');
    }
  };

  if (!messageData) return <p>메시지를 불러오는 중...</p>;

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
        <title>친구가 보낸 공유 메시지</title>
        <meta property="og:title" content="뽕톡에서 보낸 메시지" />
        <meta property="og:description" content={messageData.message || "친구가 보낸 특별한 메시지를 확인해보세요!"} />
        <meta property="og:image" content={messageData.imageurls?.[0] || "https://ppongtok-app.vercel.app/logo.png"} />
        <meta property="og:url" content={currentUrl} />
      </Head>

      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>💌 친구가 보낸 메시지</h2>
        
        <div className={styles["moving-box"]} ref={previewRef}>
          {messageData.type === "video" && <video src={messageData.videoUrl} controls autoPlay muted loop className={styles["media-element"]} />}
          {messageData.type === "image" && messageData.imageurls?.map((img, i) => <img key={i} src={img} alt={`img-${i}`} className={styles["media-element"]} />)}
          {messageData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{messageData.message}</div></div>}
        </div>
        
        {messageData.music && <audio src={messageData.music} autoPlay controls style={{ width: '100%', marginTop: '15px' }} />}

        <div className={styles["share-button-grid"]}>
          <button onClick={handleKakaoShare} className={styles["share-button"]}>카카오톡</button>
          <button onClick={handleCopyLink} className={styles["share-button"]}>링크 복사</button>
          <button onClick={handleDownloadMedia} className={styles["share-button"]}>원본 저장</button>
          <button onClick={handleSaveAsImage} className={styles["share-button"]}>이미지로 저장</button>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className={styles["share-button"]}>페이스북</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("뽕톡에서 보낸 메시지 확인하기!")}`} target="_blank" rel="noopener noreferrer" className={styles["share-button"]}>트위터</a>
        </div>

        {currentUrl && (
          <div className={styles["qrBox"]}>
            <p>📱 QR코드로 공유하기</p>
            <div style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
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