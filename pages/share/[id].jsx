// pages/share/[id].jsx (최종 공유 확인 페이지의 올바른 코드)

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { doc, getDoc } from 'firebase/firestore';
// ✨ [수정] 경로를 ../../ 로 수정했습니다.
import { db } from '../../src/firebase';
import { QRCodeSVG } from 'qrcode.react';
import appStyles from '../../src/styles/AppTheme.module.css';
import shareStyles from '../../src/styles/sharepage.module.css';

const ICON_PATHS = {
  kakao: '/icons/2.png',
  link: '/icons/104.png',
  facebook: '/icons/105.png',
  twitter: '/icons/106.png',
  more: '/icons/more.png',
};

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [messageData, setMessageData] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('/default-og-image.png');

  useEffect(() => {
    if (!router.isReady || !id) return;

    // 최종적으로 공유될 URL 주소입니다.
    const currentUrl = `${window.location.origin}/present/${id}`;
    setShareUrl(currentUrl);

    // Firestore에서 id에 해당하는 메시지 데이터를 가져옵니다.
    const fetchMessage = async () => {
      try {
        const docRef = doc(db, 'messages', String(id));
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          alert('존재하지 않는 메시지입니다.');
          router.push('/');
          return;
        }

        const data = docSnap.data();
        setMessageData(data);

        // 카카오톡 공유 등에서 썸네일로 사용될 OG 이미지를 설정합니다.
        const imageUrlForOg =
          data.type === 'video'
            ? data.videoUrl
            : Array.isArray(data.imageUrls) && data.imageUrls.length > 0
            ? data.imageUrls[0]
            : '/default-og-image.png';

        setOgImageUrl(imageUrlForOg);
      } catch (err) {
        console.error('메시지 불러오기 실패:', err);
        alert('오류가 발생했습니다.');
        router.push('/');
      }
    };

    fetchMessage();
  }, [id, router]);

  // 카카오 SDK 로드
  useEffect(() => {
    const kakaoSdk = document.getElementById('kakao-sdk');
    if (kakaoSdk) return;

    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '본인의 카카오 JavaScript 키');
      }
    };
    document.head.appendChild(script);
  }, []);

  const shareKakao = () => {
    if (!messageData || !window.Kakao?.Share) {
      alert('공유 기능이 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const title = messageData.message || '뿅!톡으로 특별한 메시지가 도착했어요';

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title,
        description: '친구의 마음이 담긴 메시지를 지금 확인해보세요!',
        imageUrl: ogImageUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: '메시지 보러가기',
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
    });
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다! 원하는 곳에 붙여넣어 공유하세요.');
    } catch {
      alert('링크 복사에 실패했습니다.');
    }
  };

  const shareFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');

  const shareTwitter = () =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent('뿅!톡으로 특별한 메시지가 도착했어요! 💌')}&url=${encodeURIComponent(
        shareUrl
      )}`,
      '_blank'
    );

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: '뿅!톡 메시지',
        text: '친구의 마음이 담긴 메시지를 확인해보세요!',
        url: shareUrl,
      });
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  if (!messageData) return <div className={appStyles.pageContainer}>로딩 중...</div>;

  return (
    <>
      <Head>
        <title>마음 공유하기</title>
        <meta property="og:title" content={messageData.message || '뿅!톡으로 특별한 메시지가 도착했어요'} />
        <meta property="og:description" content="친구의 마음이 담긴 메시지를 지금 확인해보세요!" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
      </Head>

      <div className={`${appStyles.pageContainer} ${shareStyles.shareContainer}`}>
        <h2 className={appStyles.pageTitle}>마음을 공유해보세요</h2>
        <div className={shareStyles.qrCodeBox}>
          <QRCodeSVG value={shareUrl} size={180} fgColor="#333" />
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
    </>
  );
}