// ppongtok-app/pages/index.jsx

import Head from 'next/head';
import { useState } from 'react';
// ShareButton 컴포넌트의 실제 경로를 확인해주세요.

import ShareButton from '.. /src/components/sharebutton';
import appStyles from '../src/styles/AppTheme.module.css';

export default function Home() {
  // ✅ 1. 대표 이미지 경로를 public/images/cosmos.jpg로 변경
  const representImage = '/images/cosmos.jpg';

  // ✅ 2. 개발 환경과 배포 환경을 자동으로 구분하여 BASE_URL 설정
  const BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://ppongtok-app.vercel.app' 
    : 'http://localhost:3000';
  
  const [myMessageId, setMyMessageId] = useState('example-message-123');
  const [messageTitle, setMessageTitle] = useState('뿅!톡 - 나만의 메시지를 만들어보세요');
  const [messageDesc, setMessageDesc] = useState('영상과 이미지를 담아 특별한 메시지를 공유하세요!');
  const [messageImageUrl, setMessageImageUrl] = useState(`${BASE_URL}${representImage}`);

  // ✅ 3. 공유될 최종 URL
  const shareLinkUrl = myMessageId ? `${BASE_URL}/present/${myMessageId}` : '';

  // ✅ 4. ShareButton에 전달될 content 객체
  const shareContent = shareLinkUrl ? {
    objectType: 'feed',
    content: {
      title: messageTitle,
      description: messageDesc,
      imageUrl: messageImageUrl,
      link: {
        mobileWebUrl: shareLinkUrl,
        webUrl: shareLinkUrl,
      },
    },
    buttons: [
      {
        title: '메시지 확인하기',
        link: {
          mobileWebUrl: shareLinkUrl,
          webUrl: shareLinkUrl,
        },
      },
    ],
  } : null;

  return (
    <div className={appStyles.pageContainer}>
      <Head>
        <title>뿅톡 - 영상/이미지 메시지 앱</title>
        <meta name="description" content="영상과 이미지를 통해 마음을 전달하는 앱" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={messageTitle} />
        <meta property="og:description" content={messageDesc} />
        {/* OG 이미지는 전체 주소로 제공해야 합니다 */}
        <meta property="og:image" content={messageImageUrl} />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:type" content="website" />
      </Head>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 className={appStyles.pageTitle}>환영합니다, 뿅톡! ✨</h1>
        <p className={appStyles.pageDescription}>
          당신의 특별한 영상과 이미지 메시지를 만들고 친구들과 공유해보세요.
        </p>

        <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: 'var(--box-shadow)' }}>
          <h2 style={{ fontSize: '1.5em', marginBottom: '15px' }}>💌 공유 미리보기</h2>
          <img src={representImage} alt="메시지 미리보기" style={{ width: '100%', borderRadius: '8px' }} />
          <h3 style={{ marginTop: '15px' }}>{messageTitle}</h3>
          <p style={{ color: '#555' }}>{messageDesc}</p>
        </div>

        <div style={{ marginTop: '40px' }}>
          {shareContent ? (
            <ShareButton shareContent={shareContent}>
              이 메시지 카카오톡으로 공유하기
            </ShareButton>
          ) : (
            <p>공유 정보를 불러오는 중입니다...</p>
          )}
        </div>
      </main>
    </div>
  );
}