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

  // 💡 [핵심 수정] Kakao SDK 초기화 함수
  // 이 함수는 아래 <Script> 태그의 onLoad 속성에 의해 호출됩니다.
  const initializeKakao = () => {
    // ⚠️ 이 방식은 보안에 취약하므로, 테스트 용도로만 사용하시는 것을 권장합니다.
    // 키 값을 따옴표(')로 감싸서 올바른 '문자열'로 만들어 주었습니다.
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
        imageUrl: "/logo.png",
        link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
      },
      buttons: [{ title: "메시지 확인하기", link: { mobileWebUrl: currentUrl, webUrl: currentUrl } }],
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
      {/* onLoad 속성으로 스크립트 로드 후 초기화 함수를 안전하게 실행합니다. */}
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