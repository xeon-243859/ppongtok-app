// ppongtok-app/pages/share/[id].jsx

import { useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from 'next/link'; // Next.js의 Link 컴포넌트 사용
import { QRCode } from "react-qr-code";
import styles from "../../src/styles/sharepage.module.css"; // CSS 모듈 경로는 본인 프로젝트에 맞게 확인하세요.

// --- 서버 사이드(SSR)에서 실행될 데이터 로딩 함수 ---
// 이 함수는 페이지가 사용자에게 보여지기 전에 서버에서 먼저 실행됩니다.
async function fetchMessageData(id) {
  // 실제 앱에서는 이 부분을 DB나 외부 API에서 데이터를 가져오는 로직으로 대체해야 합니다.
  // 지금은 사용자님의 public 폴더에 있는 이미지들을 기준으로 임시 데이터를 만듭니다.
  const messages = {
    'message-leaf': {
      id: 'message-leaf',
      title: '[퐁톡] 자연의 편안함을 담은 메시지',
      description: '푸른 잎사귀처럼 싱그러운 마음을 전합니다. 항상 응원해요!',
      imageUrl: '/images/leaves.jpg', // public/images/leaves.jpg
    },
    'message-road': {
      id: 'message-road',
      title: '[퐁톡] 당신의 앞날을 응원하는 메시지',
      description: '곧게 뻗은 길처럼 당신의 미래도 밝게 빛나기를 바랍니다.',
      imageUrl: '/images/road.jpg', // public/images/road.jpg
    },
    'message-test': {
      id: 'message-test',
      title: '[퐁톡] 테스트용 특별 메시지',
      description: '이 메시지는 테스트를 위해 생성되었습니다. 이미지가 잘 보이나요?',
      imageUrl: '/images/test-image.jpg', // public/images/test-image.jpg
    },
    // 다른 메시지들도 필요하다면 여기에 추가...
  };

  // 요청된 id에 해당하는 메시지를 반환합니다. 없으면 null.
  return messages[id] || null;
}

// ✅ Next.js의 서버 사이드 렌더링(SSR)을 위한 핵심 함수
export async function getServerSideProps(context) {
  const { id } = context.params; // URL에서 [id] 값 (e.g., 'message-leaf')을 가져옵니다.
  const messageData = await fetchMessageData(id);

  // 만약 id에 해당하는 메시지 데이터가 없다면, 404 Not Found 페이지를 보여줍니다.
  if (!messageData) {
    return { notFound: true };
  }

  // messageData를 페이지 컴포넌트의 props로 전달합니다.
  return {
    props: {
      messageData,
    },
  };
}


// --- 페이지 컴포넌트 ---
// getServerSideProps에서 전달한 messageData를 props로 직접 받습니다.
export default function ShareMessagePage({ messageData }) {
  const router = useRouter();
  
  const BASE_URL = 'https://ppongtok-app.vercel.app'; // 배포된 앱의 실제 주소
  const currentShareUrl = `${BASE_URL}${router.asPath}`; // 현재 페이지의 전체 URL (e.g., https://.../share/message-leaf)

  const handleShareToKakao = useCallback(() => {
    // 카카오 SDK가 로드되었는지 확인
    if (window.Kakao && window.Kakao.isInitialized()) {
      const { title, description, imageUrl } = messageData;

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: title,
          description: description,
          // 이미지 URL을 전체 절대 경로로 만들어줍니다.
          // 대체 이미지도 public 폴더에 '실제로 있는' 파일로 지정합니다.
          imageUrl: `${BASE_URL}${imageUrl || '/images/leaves.jpg'}`, 
          link: { mobileWebUrl: currentShareUrl, webUrl: currentShareUrl },
        },
        buttons: [
          {
            title: "메시지 확인하기",
            link: { mobileWebUrl: currentShareUrl, webUrl: currentShareUrl },
          },
        ],
      });
    } else {
      alert("카카오 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  }, [messageData, currentShareUrl]);


  return (
    <>
      {/* Head 태그에 동적으로 메타 정보를 설정합니다. 카카오톡 미리보기에 매우 중요합니다. */}
      <Head>
        <title>{messageData.title}</title>
        <meta property="og:title" content={messageData.title} />
        <meta property="og:description" content={messageData.description} />
        {/* OG 이미지 태그에도 전체 절대 경로를 사용합니다. */}
        <meta property="og:image" content={`${BASE_URL}${messageData.imageUrl}`} />
        <meta property="og:url" content={currentShareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="퐁톡" />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>
          {messageData.title}
        </h1>
        
        {/* 공유된 이미지나 비디오를 보여주는 영역 */}
        <div className={styles.contentBox}>
           <img src={messageData.imageUrl} alt={messageData.title} className={styles.mainImage} />
           <p className={styles.messageText}>{messageData.description}</p>
        </div>


        <div className={styles.shareSection}>
            <p>이 메시지를 친구에게 공유해보세요!</p>
            <div className={styles.qrCodeBackground}>
                <QRCode value={currentShareUrl} size={128} />
            </div>
            {/* 카카오톡 공유 버튼. 아이콘 경로는 public/icons/2.png를 가리킵니다. */}
            <button onClick={handleShareToKakao} className={styles.kakaoButton}>
                <img src="/icons/2.png" alt="카카오톡 아이콘" />
                카카오톡으로 공유하기
            </button>
        </div>
        
        {/* ✅✅✅ <Link> 컴포넌트 수정 완료 ✅✅✅ */}
        {/* <a> 태그를 제거하고, className을 <Link>에 직접 적용했습니다. */}
        <Link href="/" className={styles.homeButton}>
          🏠 나도 메시지 만들러 가기
        </Link>
      </div>
    </>
  );
}