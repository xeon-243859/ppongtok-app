import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { QRCode } from "react-qr-code";
import styles from "../../src/styles/sharepage.module.css"; // 전용 CSS 파일 사용

export default function ShareMessagePage() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  // Kakao SDK 초기화 함수
  const initializeKakao = () => {
    // ⚠️ 최종 배포 시에는 보안을 위해 .env.local 파일을 사용하세요.
    const kakaoKey = '4abf45cca92e802defcd2c15a6615155';
    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
      console.log("✅ Kakao SDK 로드 및 초기화 완료");
      setIsKakaoReady(true);
    }
  };

  // 공유할 URL 설정
  useEffect(() => {
    if (router.isReady && id) {
      setCurrentUrl(`${window.location.origin}/present/${id}`);
    }
  }, [router.isReady, id]);

  // --- 핸들러 함수들 ---

  // ✅ [핵심 수정] 카카오톡 공유 핸들러에 커스텀 버튼을 추가했습니다.
  const handleKakaoShare = () => {
    if (!isKakaoReady) {
      alert("아직 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "특별한 메시지가 도착했어요",
        description: "친구에게 온 영상/이미지 메시지를 확인해보세요!",
        imageUrl: "/logo.png", // public/logo.png
        link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
      },
      // ✅ [핵심 수정] buttons 배열에 새로운 버튼 객체를 추가했습니다.
      buttons: [
        {
          title: "메시지 확인하기", // 1. 기존 버튼
          link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
        },
        {
          title: "[뿅!톡] 이용하기 (무료이용권 3매 제공)", // 2. ✨ 새로운 커스텀 버튼
         
        },
      ],
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert("클립보드에 링크가 복사되었어요!");
    });
  };

  if (!currentUrl) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>공유 링크를 생성하는 중...</p>;
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
        strategy="afterInteractive"
        onLoad={initializeKakao}
      />
      <Head>
        <title>메시지 공유하기</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>
          누구에게 내 마음을 전할까요?
        </h1>

        <div className={styles.qrBox}>
          <p>📱 QR코드로 바로 공유하기</p>
          <div className={styles.qrCodeBackground}>
            <QRCode value={currentUrl} size={140} />
          </div>
        </div>

        <div className={styles.shareGrid}>
          <button onClick={handleKakaoShare} className={styles.shareButton}>카카오톡</button>
          <button onClick={handleCopyLink} className={styles.shareButton}>링크 복사</button>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>페이스북</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("친구에게 온 특별한 메시지를 확인해보세요!")}`} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>트위터</a>
        </div>
        
        <button className={styles.homeButton} onClick={() => router.push("/")}>
          🏠 처음으로 돌아가기
        </button>
      </div>
    </>
  );
}