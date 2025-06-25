// next.config.js

// 1. next-pwa 라이브러리를 불러옵니다.
const withPWA = require('next-pwa')({
  dest: 'public', // 생성될 서비스 워커 파일의 목적지를 'public' 폴더로 지정합니다.
  register: true, // 서비스 워커를 자동으로 등록하는 스크립트를 생성합니다.
  skipWaiting: true, // 새 버전의 PWA가 활성화될 때, 사용자가 즉시 업데이트된 내용을 볼 수 있도록 합니다.
  disable: process.env.NODE_ENV === 'development', // 개발 모드에서는 PWA 기능을 비활성화합니다. (개발 시 불필요한 캐싱 방지)
});

// 2. 기존의 Next.js 설정을 정의합니다.
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드에서 React StrictMode를 비활성화하여 이중 렌더링 및 useEffect 중복 실행을 방지합니다.
  reactStrictMode: false,

  // SWC 컴파일러를 사용하여 빌드 속도를 높입니다.
  swcMinify: true,

  // Next.js Image 컴포넌트에서 사용할 외부 이미지 도메인을 설정합니다.
  // 보안을 위해 허용할 도메인 목록을 명시적으로 관리해야 합니다.
  images: {
    domains: [
      'k.kakaocdn.net',          // 카카오 공유 시 사용되는 이미지 도메인
      'ppongtok-app.vercel.app', // Vercel 배포 도메인 (본인 도메인으로 변경 가능)
      // 🔥 Firebase Storage를 사용하므로, 해당 도메인을 반드시 추가해야 합니다.
      'firebasestorage.googleapis.com',
    ],
  },
};

// 3. withPWA 함수로 기존 설정을 감싸서 PWA 기능을 통합한 후 내보냅니다.
module.exports = withPWA(nextConfig);