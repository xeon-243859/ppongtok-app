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
  const [isKakaoReady, setIsKakaoReady] = useState(false); // 💡 이 상태가 필요합니다.
  const router = useRouter();
  const { id } = router.query;
  const previewRef = useRef(null);

  // ✅ Kakao SDK 및 디버깅 로직을 포함한 useEffect (수정 완료)
  useEffect(() => {
    // 1. 환경 변수에서 키를 읽어옵니다.
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY4abf45cca92e802defcd2c15a6615155
    
    // 2. alert으로 키가 제대로 로드되었는지 확인합니다.
    alert(`현재 불러온 키: ${kakaoKey}`);

    // 3. 키가 존재하는 경우에만 초기화를 시도합니다.
    if (kakaoKey) {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
        alert("Kakao SDK 초기화를 시도했습니다.");
        setIsKakaoReady(true);
      }
    } else {
      alert("오류: 카카오 키를 불러오지 못했습니다. .env.local 또는 Vercel 설정을 확인하세요.");
    }
    
  }, []); // ✅ 빈 배열을 넣어 페이지 로드 시 '한 번만' 실행되도록 합니다.

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

  // 📤 카카오톡 공유
  const handleKakaoShare = () => {
    if (window.Kakao && messageData) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "뽕톡에서 보낸 메시지",
          description: messageData.message || "친구가 보낸 특별한 메시지를 확인해보세요!",
          // 카카오톡 미리보기에 표시될 이미지. 첫 번째 이미지를 사용하거나 없으면 기본 로고 사용
          imageUrl:
            messageData.imageurls?.[0] ||
            "https://ppongtok-app.vercel.app/logo.png", // public 폴더에 logo.png 같은 기본 이미지를 넣어두세요.
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
        buttons: [
          {
            title: "메시지 확인하기",
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
        ],
      });
    }
  };

  // 🔗 링크 복사
  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert("클립보드에 링크가 복사되었어요!");
    });
  };

  // 🖼️ 현재 화면을 이미지로 저장
  const handleSaveAsImage = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement("a");
    link.download = `ppongtok-message-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // 💾 원본 파일(영상/이미지) 저장
  const handleDownloadMedia = async () => {
    if (!messageData) return;
    
    let url;
    let filename;

    if (messageData.type === 'video' && messageData.videoUrl) {
      url = messageData.videoUrl;
      filename = `ppongtok-video-${id}.mp4`;
    } else if (messageData.type === 'image' && messageData.imageurls?.[0]) {
      // 첫 번째 이미지를 다운로드 대상으로 함
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
      {/* 💡 Kakao SDK 로드 (head가 아닌 body 맨 아래에 로드하는 것이 성능에 유리) */}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
        integrity="sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG2PkYyFsaHYgEGUNsplYw"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Head>
        <title>친구가 보낸 공유 메시지</title>
        {/* SNS 미리보기를 위한 메타 태그 */}
        <meta property="og:title" content="뽕톡에서 보낸 메시지" />
        <meta property="og:description" content={messageData.message || "친구가 보낸 특별한 메시지를 확인해보세요!"} />
        <meta property="og:image" content={messageData.imageurls?.[0] || "https://ppongtok-app.vercel.app/logo.png"} />
        <meta property="og:url" content={currentUrl} />
      </Head>

      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>💌 친구가 보낸 메시지</h2>
        
        {/* 캡처 및 표시 영역 */}
        <div className={styles["moving-box"]} ref={previewRef}>
          {messageData.type === "video" && <video src={messageData.videoUrl} controls autoPlay muted loop className={styles["media-element"]} />}
          {messageData.type === "image" && messageData.imageurls?.map((img, i) => <img key={i} src={img} alt={`img-${i}`} className={styles["media-element"]} />)}
          {messageData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{messageData.message}</div></div>}
        </div>
        
        {messageData.music && <audio src={messageData.music} autoPlay controls style={{ width: '100%', marginTop: '15px' }} />}

        {/* --- 🔘 버튼 그룹 --- */}
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