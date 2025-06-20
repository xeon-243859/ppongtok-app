// ppongtok-app/pages/index.jsx

import Head from 'next/head';
import ShareButton from '../src/components/sharebutton';
                                                  //     pages 폴더 바로 아래면 '../components/ShareButton' 가 맞습니다.**
import { useState } from 'react';

export default function Home() {
  const [myMessageId, setMyMessageId] = useState('example-message-123');
  const [messageTitle, setMessageTitle] = useState('나만의 특별한 메시지 - 퐁톡');
  const [messageDesc, setMessageDesc] = useState('영상과 이미지를 담아 마음을 전해보세요! 지금 바로 확인!');
  const [messageImageUrl, setMessageImageUrl] = useState('/images/default_share_image.jpg');

  const BASE_URL = 'https://ppongtok-app.vercel.app';
  const shareLinkUrl = `${BASE_URL}/share/${myMessageId}`;

  const kakaoShareContent = {
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
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <Head>
        <title>퐁톡 - 영상/이미지 메시지 앱</title>
        <meta name="description" content="영상과 이미지를 통해 마음을 전달하는 앱" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="퐁톡 - 나만의 메시지를 만들어보세요!" />
        <meta property="og:description" content="영상과 이미지를 담아 특별한 메시지를 공유하세요!" />
        <meta property="og:image" content="https://ppongtok-app.vercel.app/images/app_main_thumbnail.jpg" />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="퐁톡" />
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
        <h1 style={{ color: '#333', fontSize: '2.5em', marginBottom: '20px' }}>환영합니다, 퐁톡! ✨</h1>
        <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '30px' }}>
          이곳에서 당신의 특별한 영상과 이미지 메시지를 만들고 친구들과 공유해보세요.
        </p>

        <div style={{ border: '1px solid #ddd', padding: '25px', borderRadius: '10px', marginTop: '30px', marginBottom: '40px', backgroundColor: '#f9f9f9', textAlign: 'left' }}>
          <h2 style={{ color: '#444', fontSize: '1.8em', marginBottom: '15px' }}>💌 내 메시지 미리보기</h2>
          <p style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '8px' }}>제목: <span style={{ color: '#007bff' }}>{messageTitle}</span></p>
          <p style={{ fontSize: '1em', color: '#666', marginBottom: '15px' }}>설명: {messageDesc}</p>
          {messageImageUrl && (
            <img src={messageImageUrl} alt="메시지 미리보기" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
          )}
          <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#888', fontStyle: 'italic' }}>
            (이것은 가상의 메시지 미리보기입니다. 실제 메시지를 생성하고 나만의 콘텐츠를 추가해보세요.)
          </p>
          <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#888' }}>
            공유될 링크: <a href={shareLinkUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>{shareLinkUrl}</a>
          </p>
        </div>

        <ShareButton shareContent={kakaoShareContent}>
          이 메시지 카카오톡으로 공유하기
        </ShareButton>

        <p style={{ marginTop: '30px', fontSize: '15px', color: '#666' }}>
          위에 있는 버튼을 클릭하여 당신의 특별한 메시지를 친구들에게 공유해보세요!
          <br />웹 표준 공유와 카카오톡 공유를 모두 시도합니다.
        </p>
      </main>
    </div>
  );
}