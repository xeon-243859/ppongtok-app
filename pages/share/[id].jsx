import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { QRCode } from "react-qr-code";
import styles from "../../src/styles/sharepage.module.css"; // 💡 [핵심] 이 페이지 전용 새 CSS 파일을 사용합니다.

export default function ShareMessagePage() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const router = useRouter();
  const { id } = router.query;

 useEffect(() => {
  const kakaoKey = '4abf45cca92e802defcd2c15a6615155';
  // ...
}, []);

  // 공유할 URL 설정
  useEffect(() => {
    if (router.isReady && id) {
      setCurrentUrl(`${window.location.origin}/present/${id}`);
    }
  }, [router.isReady, id]);

  // --- 핸들러 함수들 ---
  const handleKakaoShare = () => {
    if (!isKakaoReady) return alert("공유 기능이 준비되지 않았습니다.");
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "특별한 메시지가 도착했어요",
        description: "친구에게 온 영상/이미지 메시지를 확인해보세요!",
        imageUrl: "/logo.png", // public 폴더의 기본 로고 이미지
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

  // 데이터 로딩이 필요 없으므로, 로딩 상태를 간단히 처리합니다.
  if (!currentUrl) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>공유 링크를 생성하는 중...</p>;
  }

  // --- 렌더링 부분 (완전히 새로 구성) ---
  return (
    <>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js" strategy="afterInteractive" />
      <Head>
        <title>메시지 공유하기</title>
      </Head>

      <div className={styles.container}>
        {/* 1. 튀어나 보이는 제목 */}
        <h1 className={styles.title}>
          누구에게 내 마음을 전할까요?
        </h1>

        {/* 2. QR 코드 */}
        <div className={styles.qrBox}>
          <p>📱 QR코드로 바로 공유하기</p>
          <div className={styles.qrCodeBackground}>
            <QRCode value={currentUrl} size={180} />
          </div>
        </div>

        {/* 3. 공유 버튼 (2x2 그리드) */}
        <div className={styles.shareGrid}>
          <button onClick={handleKakaoShare} className={styles.shareButton}>카카오톡</button>
          <button onClick={handleCopyLink} className={styles.shareButton}>링크 복사</button>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>페이스북</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("친구에게 온 특별한 메시지를 확인해보세요!")}`} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>트위터</a>
        </div>
        
        {/* 4. '처음으로' 버튼 */}
        <button className={styles.homeButton} onClick={() => router.push("/")}>
          🏠 처음으로 돌아가기
        </button>
      </div>
    </>
  );
}