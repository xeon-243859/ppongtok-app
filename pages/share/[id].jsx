// pages/share/[id].js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'; // Head import 추가
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase';
import QRCode from 'qrcode.react';

import appStyles from '../../src/styles/AppTheme.module.css';
import shareStyles from '../../src/styles/sharepage.module.css';

const ICON_PATHS = { kakao: '/icons/2.png', link: '/icons/link.png', facebook: '/icons/facebook.png', twitter: '/icons/twitter.png', more: '/icons/more.png' };

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState(''); // OG 태그용 이미지 URL

  // 1. 메시지 불러오기 및 URL 설정
  useEffect(() => {
    if (!router.isReady || !id) return;

    // ❗️ window 객체는 클라이언트 사이드에서만 접근 가능하므로 useEffect 안에 위치
    const currentUrl = `${window.location.origin}/present/${id}`;
    setShareUrl(currentUrl);

    const fetchMessage = async () => {
      try {
        const docRef = doc(db, 'messages', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMessage(data);
          
          // ❗️ 핵심 수정: 'imageurls' -> 'imageUrls'로 변경
          // 첫 번째 이미지를 대표 이미지(OG, 카카오 공유 썸네일)로 사용
          const imageUrl = (data.type === 'image' && Array.isArray(data.imageUrls) && data.imageUrls.length > 0)
            ? data.imageUrls[0]
            : ''; // 비디오는 썸네일이 없으므로 빈 값 처리
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
  }, [id, router.isReady, router]);

  // 2. 카카오 SDK 초기화 (기존 로직 유지, 안정적)
  useEffect(() => {
    if (document.getElementById('kakao-sdk')) return;
    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('4abf45cca92e802defcd2c15a6615155'); // 본인 키 확인
      }
    };
    document.head.appendChild(script);
  }, []);

  // 3. 카카오 공유 함수
  const shareKakao = () => {
    if (!message || !window.Kakao?.Share) {
      alert('카카오 공유를 준비 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '뿅!톡 메시지가 도착했어요!',
        description: message.message || '친구에게 온 마음을 확인해보세요.', // message 필드명 확인
        imageUrl: ogImageUrl, // 위에서 설정한 대표 이미지 URL 사용
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: '메시지 확인하기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  };

  // 나머지 공유 핸들러들 (기존과 동일)
  const copyLink = async () => { /* ... */ };
  const shareFacebook = () => { /* ... */ };
  const shareTwitter = () => { /* ... */ };
  const nativeShare = async () => { /* ... */ };
  
  // 렌더링
  if (!message) return <div className={appStyles.pageContainer}>로딩 중...</div>;

  return (
    <>
      {/* OG 태그 추가: 카톡, 페북 등에서 링크 미리보기를 위함 */}
      <Head>
        <title>마음 공유하기</title>
        <meta property="og:title" content="뿅!톡 메시지가 도착했어요!" />
        <meta property="og:description" content={message.message || "친구에게 온 마음을 확인해보세요."} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={shareUrl} />
      </Head>

      <div className={`${appStyles.pageContainer} ${shareStyles.shareContainer}`}>
        {/* 이하 기존 JSX 코드와 동일 */}
        <h2 className={appStyles.pageTitle}>마음을 공유해보세요</h2>
        <div className={shareStyles.qrCodeBox}>
            <QRCode value={shareUrl} size={180} fgColor="#333" />
            <p>QR코드를 스캔하여 바로 확인할 수 있어요</p>
        </div>
        <div className={shareStyles.buttonGrid}>
            <button onClick={shareKakao} className={shareStyles.shareButton}><img src={ICON_PATHS.kakao} alt="카카오톡" /><span>카카오톡</span></button>
            {/* ... 나머지 버튼들 ... */}
        </div>
        <div className={appStyles.navButtonContainer} style={{ marginTop: '40px' }}>
            <button onClick={() => router.push('/')} className={appStyles.buttonPrimary}>🏠 처음으로</button>
        </div>
      </div>
    </>
  );
}