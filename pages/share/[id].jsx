// ppongtok-app/pages/share/[id].jsx

import React, { useEffect, useState } from 'react'; // ✅ 'react' 앞에 from을 추가했습니다.
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase';
import QRCode from 'qrcode.react';
import appStyles from '../../src/styles/AppTheme.module.css';
import shareStyles from '../../src/styles/SharePage.module.css';

// 아이콘 경로를 실제 파일에 맞게 설정합니다.
const ICON_PATHS = {
  kakao: '/icons/2.png',
  link: '/icons/104.png',
  facebook: '/icons/105.png',
  twitter: '/icons/106.png',
  more: '/icons/more.png', // '더보기'를 위한 아이콘 (public/icons 폴더에 있어야 합니다)
};

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');

  // 메시지 데이터 불러오기 및 공유 URL 설정
  useEffect(() => {
    // router.query가 준비될 때까지 기다립니다.
    if (!router.isReady) return;

    // window 객체가 있을 때만 실행하여 서버 사이드 렌더링 오류를 방지합니다.
    if (typeof window !== 'undefined') {
      const currentUrl = `${window.location.origin}/present/${id}`;
      setShareUrl(currentUrl);

      const fetchMessage = async () => {
        const docRef = doc(db, 'messages', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMessage(data);
          const imageUrl = data.type === 'video' 
            ? (data.videoUrl || '/images/cosmos.jpg')
            : (data.imageurls?.[0] || '/images/cosmos.jpg');
          
          setOgImageUrl(`${window.location.origin}${imageUrl}`);
        } else {
          alert('존재하지 않는 메시지입니다.');
          router.push('/');
        }
      };
      fetchMessage();
    }
  }, [id, router.isReady]); // router.isReady를 의존성 배열에 추가

  // 카카오 SDK 초기화
  useEffect(() => {
    // SDK 스크립트가 이미 있는지 확인하여 중복 로드를 방지합니다.
    if (document.getElementById('kakao-sdk')) {
        if(window.Kakao && !window.Kakao.isInitialized()) {
             window.Kakao.init(process.env.NEXT_PUBLIC_KAKAOTOK_KEY);
        }
        return;
    };

    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true; // 비동기 로딩
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // ✅ .env.local 파일에서 키를 안전하게 가져오는 것을 강력히 권장합니다.
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAOTOK_KEY);
      }
    };
    document.head.appendChild(script);
  }, []);

  // 공유 기능 핸들러들
  const shareKakao = () => {
    if (!window.Kakao?.Share) {
      alert('카카오톡 SDK를 불러오고 있습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!message) {
      alert('공유할 메시지 정보를 불러오는 중입니다.');
      return;
    }
    
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: message.caption || '뿅!톡으로 특별한 메시지가 도착했어요',
        description: '친구의 마음이 담긴 메시지를 지금 확인해보세요!',
        imageUrl: ogImageUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: '메시지 보러가기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  };

  const copyLink = async () => {
    if (!navigator.clipboard) {
        alert('이 브라우저에서는 클립보드 복사를 지원하지 않습니다.');
        return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다!');
    } catch (err) {
      alert('링크 복사에 실패했습니다.');
    }
  };

  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  
  const shareTwitter = () => {
    const text = `뿅!톡으로 특별한 메시지가 도착했어요! 💌`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: '뿅!톡 메시지',
        text: '친구의 마음이 담긴 메시지를 지금 확인해보세요!',
        url: shareUrl,
      });
    } else {
      alert('사용 중인 브라우저에서는 이 기능을 지원하지 않습니다.');
    }
  };
  
  if (!message) return <div className={appStyles.pageContainer}>메시지 정보를 불러오는 중...</div>;

  return (
    <div className={`${appStyles.pageContainer} ${shareStyles.shareContainer}`}>
      <h2 className={appStyles.pageTitle}>마음을 공유해보세요</h2>
      
      <div className={shareStyles.qrCodeBox}>
        {shareUrl && <QRCode value={shareUrl} size={180} fgColor="#333" />}
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