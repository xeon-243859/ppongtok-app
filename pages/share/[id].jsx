import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase';
import QRCode from 'qrcode.react'; // ✅ QR코드 라이브러리
import appStyles from '../../src/styles/AppTheme.module.css';
import shareStyles from '../../src/styles/sharepage.module.css';

// ✅ 아이콘 경로를 확인해주세요. public 폴더 기준입니다.
const ICON_PATHS = {
  kakao: '/icons/2.png',
  link: '/icons/link.png',
  facebook: '/icons/facebook.png',
  twitter: '/icons/twitter.png',
  more: '/icons/more.png', // Web Share API용
};

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');

  // 1. 메시지 데이터 불러오기 및 공유 URL 설정
  useEffect(() => {
    if (!id) return;
    const currentUrl = `${window.location.origin}/present/${id}`;
    setShareUrl(currentUrl);

    const fetchMessage = async () => {
      const docRef = doc(db, 'messages', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessage(data);
        // OG 이미지를 위한 대표 이미지 설정
        const imageUrl = data.type === 'video' ? data.videoUrl : (data.imageurls?.[0] || '');
        setOgImageUrl(imageUrl);
      } else {
        console.warn('⚠️ No such document!');
        alert('존재하지 않는 메시지입니다.');
        router.push('/');
      }
    };
    fetchMessage();
  }, [id, router]);

  // 2. 카카오 SDK 초기화 (공유 페이지에서만 독립적으로 실행)
  useEffect(() => {
    if (document.getElementById('kakao-sdk')) return;
    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // 본인의 Javascript 키를 입력하세요
        window.Kakao.init('4abf45cca92e802defcd2c15a6615155');
      }
    };
    document.head.appendChild(script);
  }, []);

  // 3. 공유 기능 핸들러들
  const shareKakao = () => {
    if (!window.Kakao?.Share) {
      alert('카카오톡 SDK를 불러오고 있습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: message?.caption || '뿅!톡으로 특별한 메시지가 도착했어요',
        description: '친구의 마음이 담긴 메시지를 지금 확인해보세요!',
        imageUrl: ogImageUrl,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [{ title: '메시지 보러가기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다! 원하는 곳에 붙여넣어 공유하세요.');
    } catch (err) {
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
      alert('お使いのブラウザは共有機能をサポートしていません。リンクをコピーしてください。');
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
        {/* navigator.share가 지원될 때만 '내 연락처(더보기)' 버튼 표시 */}
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