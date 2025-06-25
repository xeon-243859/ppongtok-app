// pages/_app.js

import Head from "next/head";
import Script from "next/script";
import { AuthProvider } from "../src/contexts/AuthContext";
import "../src/index.css";

export default function MyApp({ Component, pageProps }) {
  return (
    // AuthProvider로 앱 전체를 감싸서 로그인 상태를 공유합니다.
    <AuthProvider>
      {/* Head 컴포넌트로 모든 페이지에 공통적으로 적용될 head 태그들을 관리합니다. */}
      <Head>
        {/* --- 기본 메타 태그 --- */}
        <title>뿅!톡 - 마음을 전하는 영상편지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="description" content="영상과 이미지로 세상에 단 하나뿐인 특별한 메시지를 만들어보세요." />
        
        {/* --- PWA 필수 메타 태그 --- */}
        
        {/* 1. manifest.json 연결: PWA의 명세서를 브라우저에 알려줍니다. */}
        <link rel="manifest" href="/manifest.json" />

        {/* 2. 테마 색상 지정: 앱의 상단 바(툴바) 색상을 지정합니다. */}
        <meta name="theme-color" content="#8A2BE2" />

        {/* 3. iOS(사파리) 대응: 아이폰에서도 PWA가 앱처럼 작동하도록 설정합니다. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="뿅!톡" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* --- Open Graph (OG) 태그: 소셜 공유 시 표시될 정보 --- */}
        {/* 이 태그들은 개별 페이지(예: share/[id].js)에서 덮어쓸 수 있습니다. */}
        <meta property="og:title" content="뿅!톡" />
        <meta property="og:description" content="친구의 마음이 담긴 특별한 메시지를 확인해보세요!" />
        <meta property="og:image" content="/og-image.png" /> {/* public 폴더에 기본 공유 이미지를 넣어두세요. */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="뿅!톡" />
        <meta property="og:locale" content="ko_KR" />
      </Head>

      {/* 카카오 SDK 로드: Next.js의 Script 컴포넌트를 사용하면 성능 최적화에 유리합니다. */}
      {/* strategy="beforeInteractive": 페이지가 상호작용 가능해지기 전에 스크립트를 실행합니다. */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="beforeInteractive"
        onLoad={() => {
          // 스크립트 로드가 완료되면 카카오 초기화
          if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '본인의 카카오 JavaScript 키');
          }
        }}
      />

      {/* 실제 페이지 컴포넌트가 렌더링되는 부분입니다. */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}