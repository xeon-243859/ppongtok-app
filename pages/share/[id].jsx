import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase';
import { QRCode } from 'qrcode.react';

import appStyles from '../../src/styles/AppTheme.module.css';
import shareStyles from '../../src/styles/sharepage.module.css';

const ICON_PATHS = {
  kakao: '/icons/2.png',
  link: '/icons/link.png',
  facebook: '/icons/facebook.png',
  twitter: '/icons/twitter.png',
  more: '/icons/more.png',
};

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');

  // 1. 메시지 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;

    const currentUrl = `${window.location.origin}/present/${id}`;
    setShareUrl(currentUrl);

    const fetchMessage = async () => {
      try {
        const docRef = doc(db, 'messages', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMessage(data);
          
           const imageUrl = data.type === 'video'
           ? data.videoUrl
           : Array.isArray(data.imageurls) ? data.imageurls[0] : '';
          setOgImageUrl(imageUrl);
        } else {
          alert('존재하지 않는 메시지입니다.');
          router.push('/');
        }
      } catch (err) {
        console.error('메시지 불러오기 실패:', err);
        alert('오류가 발생했습니다.');
        router.push('/');
      }
    };

    fetchMessage();
  }, [id, router]);

  // 2. 카카오 SDK 초기화
  useEffect(() => {
    if (document.getElementById('kakao-sdk')) return;
    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('4abf45cca92e802defcd2c15a6615155'); // 🔑 본인 키로 교체
      }
    };
    document.head.appendChild(script);
  }, []);

  // 3. 공유 핸들러들
  const shareKakao = () => {
  // 💥 먼저 message와 Kakao SDK가 준비됐는지 확인
  if (!message || !window.Kakao?.Share) {
    alert('카카오 공유 준비 중입니다. 잠시 후 다시 시도해 주세요.');
    return;
  }

  // ✅ message가 확실히 존재할 때만 caption 접근
  const title = message.caption || '뿅!톡으로 특별한 메시지가 도착했어요';

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title, // 위에서 안전하게 추출한 title 사용
      description: '친구의 마음이 담긴 메시지를 지금 확인해보세요!',
      imageUrl: ogImageUrl,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: '메시지 보러가기',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
};

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다! 원하는 곳에 붙여넣어 공유하세요.');
    } catch {
      alert('링크 복사에 실패했습니다.');
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `뿅!톡으로 특별한 메시지가 도착했어요! 💌`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '뿅!톡 메시지',
          text: '친구의 마음이 담긴 메시지를 지금 확인해보세요!',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Web Share API 에러:', error);
      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다. 링크를 복사해 주세요.');
    }
  };

  if (!message) return <div className={appStyles.pageContainer}>로딩 중...</div>;

  return (
    <div className={`${appStyles.pageContainer} ${shareStyles.shareContainer}`}>
      <h2 className={appStyles.pageTitle}>마음을 공유해보세요</h2>

      <div className={shareStyles.qrCodeBox}>
        <QRCode value={shareUrl} size={180} fgColor="#333" />
        <p>QR코드를 스캔하여 바로 확인할 수 있어요</p>
      </div>

      <div className={shareStyles.buttonGrid}>
        <button onClick={shareKakao} className={shareStyles.shareButton}>
          <img src={ICON_PATHS.kakao} alt="카카오톡" />
          <span>카카오톡</span>
        </button>

        {typeof navigator !== 'undefined' && navigator.share && (
          <button onClick={nativeShare} className={shareStyles.shareButton}>
            <img src={ICON_PATHS.more} alt="더보기" />
            <span>더보기</span>
          </button>
        )}

        <button onClick={copyLink} className={shareStyles.shareButton}>
          <img src={ICON_PATHS.link} alt="링크 복사" />
          <span>링크 복사</span>
        </button>

        <button onClick={shareFacebook} className={shareStyles.shareButton}>
          <img src={ICON_PATHS.facebook} alt="페이스북" />
          <span>페이스북</span>
        </button>

        <button onClick={shareTwitter} className={shareStyles.shareButton}>
          <img src={ICON_PATHS.twitter} alt="트위터" />
          <span>트위터</span>
        </button>
      </div>

      <div className={appStyles.navButtonContainer} style={{ marginTop: '40px' }}>
        <button onClick={() => router.push('/')} className={appStyles.buttonPrimary}>
          🏠 처음으로
        </button>
      </div>
    </div>
  );
}


