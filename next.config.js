// next.config.js

// 1. next-pwa 라이브러리를 불러옵니다.
// PWA(Progressive Web App) 기능을 Next.js에 쉽게 추가해주는 역할을 합니다.
const withPWA = require('next-pwa')({
  dest: 'public', // 생성될 서비스 워커 파일(sw.js)의 목적지를 'public' 폴더로 지정합니다.
  register: true, // 서비스 워커를 클라이언트(브라우저)에 자동으로 등록하는 스크립트를 생성합니다.
  skipWaiting: true, // 새로운 버전의 서비스 워커가 설치되면, 대기 없이 즉시 활성화하여 사용자가 빠르게 업데이트를 받을 수 있게 합니다.
  disable: process.env.NODE_ENV === 'development', // 개발 모드('npm run dev')에서는 PWA 기능을 비활성화합니다. (개발 중 불필요한 캐싱 방지)
});

// 2. 기존의 Next.js 설정을 정의합니다.
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드에서 React StrictMode를 비활성화하여 이중 렌더링 및 useEffect 중복 실행을 방지합니다.
  // 이 옵션은 개발 편의성을 위한 것으로, 원인을 알 수 없는 함수 중복 호출 문제를 해결할 때 유용합니다.
  reactStrictMode: false,

  // SWC 컴파일러를 사용하여 JavaScript/TypeScript 코드를 압축(minify)합니다. 빌드 속도가 빨라집니다.
  swcMinify: true,

  // Next.js의 <Image> 컴포넌트에서 외부 URL 이미지를 사용하려면,
  // 보안상의 이유로 허용할 도메인 목록을 여기에 명시적으로 등록해야 합니다.
  images: {
    domains: [
      'k.kakaocdn.net', // 카카오 프로필, 공유 템플릿 등에 사용되는 이미지 도메인
      'ppongtok-app.vercel.app', // Vercel 배포 도메인 (필요 시 본인 도메인으로 변경)
      
      // 🔥 Firebase Storage에 업로드된 이미지를 사용하기 위해 반드시 필요한 도메인입니다.
      'firebasestorage.googleapis.com', 
    ],
  },
  
  // ======================================================================
  // [수정된 부분] Vercel 배포 환경과의 호환성을 위한 설정
  // 'standalone' 모드는 Docker와 같은 특정 환경을 위한 것으로, Vercel 기본 배포 환경에서는
  // 이 옵션이 'routes-manifest.json' 파일을 찾는 데 문제를 일으킬 수 있습니다.
  // 따라서 Vercel에 배포할 때는 이 옵션을 비활성화(주석 처리 또는 삭제)하는 것이 안전합니다.
  // output: 'standalone',  <-- 이 부분을 주석 처리하거나 삭제했습니다.
  // ======================================================================
};

// 3. withPWA 함수로 기존 설정을 감싸서 PWA 기능을 통합한 최종 설정을 내보냅니다.
// 이렇게 하면 Next.js가 PWA 설정과 기본 설정을 모두 인지하고 빌드를 진행합니다.
module.exports = withPWA(nextConfig);

