// ppongtok-app/pages/share/[id].jsx

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
// import Script from "next/script"; // _app.jsx에서 관리하므로 여기서는 제거
import { QRCode } from "react-qr-code";
import styles from "../../src/styles/sharepage.module.css"; 
import sharebutton from '../../src/components/sharebutton';

// (임시) 메시지 데이터 가져오는 함수. 실제로는 백엔드 API 호출로 대체되어야 합니다.
async function fetchMessageData(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      const messages = {
        'example-message-123': {
          id: 'example-message-123',
          title: '[퐁톡] 당신만을 위한 특별한 메시지',
          description: '영상과 이미지를 담아 마음을 전하는 퐁톡 메시지입니다.',
          imageUrl: `/images/message_thumb_1.jpg`, // public/images 폴더에 있다고 가정. 실제 썸네일 이미지 URL.
          videoUrl: null, // 영상이 있을 경우
          messageText: `안녕하세요! 퐁톡에서 보내드리는 첫 번째 특별한 메시지입니다. 확인해 주셔서 감사합니다!`,
        },
        'another-message-456': {
          id: 'another-message-456',
          title: '[퐁톡] 친구에게 도착한 새로운 영상 메시지',
          description: '사랑과 감사, 응원의 마음을 담아 영상으로 전달해보세요.',
          imageUrl: `/images/message_thumb_2.jpg`, // public/images 폴더에 있다고 가정
          videoUrl: `/videos/sample_video.mp4`, // public/videos 폴더에 있다고 가정
          messageText: `친구야, 힘든 요즘 힘내라고 영상 메시지를 보내! 늘 응원할게!`,
        },
      };
      resolve(messages[id] || null); // ID에 해당하는 메시지가 없으면 null 반환
    }, 500); // 데이터 로딩 지연 시뮬레이션
  });
}

export default function ShareMessagePage() {
  const [messageData, setMessageData] = useState(null); // 메시지 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentShareUrl, setCurrentShareUrl] = useState(""); // 공유할 최종 URL

  const router = useRouter();
  const { id } = router.query;

  // ⚠️ 중요: 배포 시에는 이 BASE_URL을 실제 서비스 도메인으로 변경해야 합니다!
  const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://ppongtok-app.vercel.app';
  // KAKAO_JAVASCRIPT_KEY는 _app.jsx에서 관리하므로 여기서는 필요 없음

  // 1. 페이지 로드 시 메시지 데이터 및 URL 설정
  useEffect(() => {
    if (!router.isReady || !id) {
      console.log("[SharePage] Router not ready or ID missing.");
      return;
    }

    setLoading(true);
    setError(null);
    console.log(`[SharePage] Fetching message data for ID: ${id}`);

    fetchMessageData(id)
      .then(data => {
        if (data) {
          setMessageData(data);
          const sharePageUrl = `${BASE_URL}/share/${id}`; // 공유될 이 페이지의 URL
          setCurrentShareUrl(sharePageUrl);
          console.log(`[SharePage] Message data loaded. Share URL: ${sharePageUrl}`);
        } else {
          setError(new Error('메시지를 찾을 수 없습니다. (ID:' + id + ')'));
          console.error(`[SharePage] Message not found for ID: ${id}`);
        }
      })
      .catch(err => {
        console.error("[SharePage] 메시지 데이터 로드 실패:", err);
        setError(new Error(`메시지 로드 중 오류 발생: ${err.message}`));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.isReady, id, BASE_URL]);


  // 2. --- 공유 핸들러 함수들 ---
  const handleShare = useCallback(async (platform) => {
    console.log(`[ShareButton] ${platform} 공유 시도 시작.`);

    if (!currentShareUrl || !messageData) {
      alert("공유할 메시지 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      console.warn(`[ShareButton] 공유 정보 미비: currentShareUrl=${currentShareUrl}, messageData=${messageData}`);
      return;
    }

    const { title, description, imageUrl } = messageData;

    // 1. Web Share API 시도 (모바일 기기 기본 공유 시트)
    if (navigator.share) {
      console.log('[ShareButton] Web Share API 지원 확인. 시도 중...');
      try {
        await navigator.share({
          title: title,
          text: description,
          url: currentShareUrl,
        });
        console.log('[ShareButton] Web Share API 성공!');
        return; // 공유 성공 시 함수 종료
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('[ShareButton] Web Share API 취소됨: 사용자가 공유를 취소했습니다.');
        } else {
          console.error('[ShareButton] Web Share API 실패:', error.name, error.message, error);
          alert('기기 기본 공유 기능에 문제가 발생했습니다. 다음 방법으로 시도합니다.');
        }
      }
    } else {
      console.warn('[ShareButton] Web Share API를 지원하지 않는 브라우저입니다. 카카오톡 SDK/클립보드 복사로 시도.');
    }

    // 2. 카카오톡 SDK 공유 시도 (Web Share API 실패 또는 미지원 시)
    // _app.jsx에서 SDK를 로드하므로, 여기서는 window.Kakao가 존재하고 초기화되었는지 확인만 합니다.
    if (platform === 'kakao' && typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
      console.log('[ShareButton] Kakao SDK 초기화됨 확인. 카카오톡 공유 시도 중...');
      try {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: title,
            description: description,
            // imageUrl이 상대경로인 경우 BASE_URL을 붙여 절대경로로 만듭니다.
            // 또한, imageUrl이 없을 경우 대체 이미지 경로를 사용합니다.
            imageUrl: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl || '/images/kakaotalk_icon.png'}`, 
            link: { mobileWebUrl: currentShareUrl, webUrl: currentShareUrl },
          },
          buttons: [
            {
              title: "메시지 확인하기",
              link: { mobileWebUrl: currentShareUrl, webUrl: currentShareUrl },
            },
            {
              title: "[뿅!톡] 이용하기 (무료이용권 3매 제공)",
              link: { mobileWebUrl: `${BASE_URL}/free-ticket`, webUrl: `${BASE_URL}/free-ticket` },
            },
          ],
        });
        console.log('[ShareButton] 카카오톡 SDK 공유 메시지 전송 요청됨.');
        return;
      } catch (error) {
        console.error('[ShareButton] 카카오톡 SDK 공유 실패:', error);
        alert('카카오톡 공유 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } else if (platform === 'kakao') {
      alert("카카오톡 공유 기능을 아직 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      console.warn("[ShareButton] Kakao SDK Not Ready for share (not initialized or not found).");
    }

    // 3. 최종 폴백: URL 클립보드 복사 (모든 공유 방식 실패 시)
    if (platform === 'copyLink') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        console.log('[ShareButton] 클립보드 복사 기능 지원 확인. URL 복사 시도 중...');
        try {
          await navigator.clipboard.writeText(currentShareUrl);
          alert('공유 링크가 클립보드에 복사되었습니다! 카카오톡에서 친구에게 직접 붙여넣기 해주세요.');
          console.log('[ShareButton] 클립보드에 URL 복사 성공.');
          return;
        } catch (err) {
          console.error('[ShareButton] 클립보드 복사 실패:', err);
          alert('링크 복사에 실패했습니다. 다음 URL을 수동으로 복사하여 공유해주세요:\n' + currentShareUrl);
        }
      } else {
        console.warn('[ShareButton] 클립보드 복사 API 미지원. 수동 복사 프롬프트 표시.');
        window.prompt("링크를 복사하여 공유해주세요:", currentShareUrl);
      }
    }
    
  }, [currentShareUrl, messageData, BASE_URL]); // 의존성 배열에 BASE_URL 추가

  // 4. 로딩 및 에러 상태 UI
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#555' }}>
        <p>메시지를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '1.2em' }}>
        <p>오류: {error.message}</p>
        <p>메시지를 표시할 수 없습니다. 다시 시도하거나 관리자에게 문의하십시오.</p>
      </div>
    );
  }

  if (!messageData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#888' }}>
        <p>요청하신 메시지를 찾을 수 없습니다.</p>
        <p>잘못된 링크이거나 삭제된 메시지일 수 있습니다.</p>
      </div>
    );
  }

  return (
    <>
      {/* 5. Kakao SDK 스크립트: _app.jsx에서 로드하므로 여기서는 제거합니다. */}

      {/* 6. OG 태그 (카카오톡 미리보기에 중요!) */}
      {/* messageData가 로드된 후에만 OG 태그를 렌더링합니다. */}
      <Head>
        <title>{messageData.title}</title>
        <meta property="og:title" content={messageData.title} />
        <meta property="og:description" content={messageData.description} />
        {/* imageUrl이 상대경로인 경우 BASE_URL을 붙여 절대경로로 만들어야 합니다. */}
        <meta property="og:image" content={messageData.imageUrl.startsWith('http') ? messageData.imageUrl : `${BASE_URL}${messageData.imageUrl}`} />
        <meta property="og:url" content={currentShareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="퐁톡" />
        {/*
        카카오톡 앱 링크용 추가 메타 태그 (필요시 활성화)
        _app.jsx에서 KAKAO_JAVASCRIPT_KEY를 전역적으로 정의하므로, 필요시 여기서는 변수만 사용하면 됩니다.
        <meta property="kakao:app_key" content={KAKAO_JAVASCRIPT_KEY}/>
        */}
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>
          누구에게 내 마음을 전할까요?
        </h1>

        <div className={styles.qrBox}>
          <p>📱 QR코드로 바로 공유하기</p>
          <div className={styles.qrCodeBackground}>
            {/* currentShareUrl이 있을 때만 QR 코드 렌더링 */}
            {currentShareUrl && <QRCode value={currentShareUrl} size={140} />}
          </div>
        </div>

        <div className={styles.shareGrid}>
          {/* Web Share API를 시도하고, 실패 시 카카오톡 SDK를 폴백으로 사용하도록 handleShare 함수 통합 */}
          <button onClick={() => handleShare('kakao')} className={styles.shareButton}>
          <img src="/icons/2.png" alt="카카오톡" className={styles.shareIcon} />
           카카오톡
         </button>
          <button onClick={() => handleShare('copyLink')} className={styles.shareButton}>링크 복사</button>
          {/* 페이스북/트위터는 이미 href로 직접 공유하므로 handleShare에 포함하지 않음 */}
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>페이스북</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent("친구에게 온 특별한 메시지를 확인해보세요!")}`} target="_blank" rel="noopener noreferrer" className={styles.shareButton}>트위터</a>
        </div>
        
        <button className={styles.homeButton} onClick={() => router.push("/")}>
          🏠 처음으로 돌아가기
        </button>
      </div>
    </>
  );
}