// ppongtok-app/pages/share/[id].jsx

import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from 'next/link'; // Link 컴포넌트 사용
import { QRCode } from "react-qr-code";
import styles from "../../src/styles/sharepage.module.css"; 
// sharebutton은 이제 페이지 내에 통합되었으므로 import 제거

// (서버 사이드에서 실행될) 메시지 데이터 가져오는 함수
async function fetchMessageData(id) {
  // 실제로는 여기서 DB나 API를 조회합니다.
  const messages = {
    'example-message-123': { /* ... 데이터 ... */ },
    'another-message-456': { /* ... 데이터 ... */ },
  };
  return messages[id] || null;
}

// ✅ Next.js의 데이터 페칭 함수
export async function getServerSideProps(context) {
  const { id } = context.params; // URL의 [id] 값을 가져옵니다.
  const messageData = await fetchMessageData(id);

  // 메시지 데이터가 없으면 404 페이지를 보여줍니다.
  if (!messageData) {
    return { notFound: true };
  }

  // messageData를 props로 페이지 컴포넌트에 전달합니다.
  return {
    props: {
      messageData,
    },
  };
}


// --- 페이지 컴포넌트 ---
// props로 messageData를 직접 받습니다.
export default function ShareMessagePage({ messageData }) {
  const router = useRouter();
  
  // 이제 useState, useEffect로 데이터를 로딩할 필요가 없습니다.
  // 서버에서 이미 다 가져왔기 때문입니다.

  const BASE_URL = 'https://ppongtok-app.vercel.app'; // 서버/클라이언트 모두에서 안전하게 사용
  const currentShareUrl = `${BASE_URL}${router.asPath}`;

  // 공유 핸들러는 그대로 사용 가능합니다.
  const handleShare = useCallback(async (platform) => {
    // ... (기존 handleShare 로직은 거의 동일하게 사용 가능, messageData를 props로 바로 사용)
    const { title, description, imageUrl } = messageData;

    // 카카오 공유 로직
    if (platform === 'kakao' && window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        // ...
        imageUrl: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl || '/images/kakaotalk_icon.png'}`,
        // ...
      });
    }
    // ... 나머지 로직
  }, [messageData, currentShareUrl, BASE_URL]);

  // 서버에서 데이터가 없으면 404 페이지로 처리되므로, 클라이언트에서 로딩/에러/데이터없음 상태를 처리할 필요가 거의 없습니다.
  
  return (
    <>
      <Head>
        <title>{messageData.title}</title>
        <meta property="og:title" content={messageData.title} />
        <meta property="og:description" content={messageData.description} />
        <meta property="og:image" content={messageData.imageUrl.startsWith('http') ? messageData.imageUrl : `${BASE_URL}${messageData.imageUrl}`} />
        <meta property="og:url" content={currentShareUrl} />
        {/* ... 나머지 Head 태그 ... */}
      </Head>

      <div className={styles.container}>
        {/* ... 기존 UI 구조는 동일 ... */}

        <div className={styles.shareGrid}>
          <button onClick={() => handleShare('kakao')} className={styles.shareButton}>
            <img src="/icons/2.png" alt="카카오톡" className={styles.shareIcon} />
            카카오톡
          </button>
          {/* ... 나머지 공유 버튼들 ... */}
        </div>
        
        {/* 버튼을 Link 컴포넌트로 변경하면 더 좋습니다. */}
        <Link href="/" passHref>
          <a className={styles.homeButton}>🏠 처음으로 돌아가기</a>
        </Link>
      </div>
    </>
  );
}