// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드에서 React StrictMode를 비활성화합니다.
  reactStrictMode: false,
  
  // SWC 컴파일러를 사용하여 빌드 속도를 높입니다.
  swcMinify: true,

  // Next.js Image 컴포넌트에서 사용할 외부 이미지 도메인을 설정합니다.
  images: {
    domains: [
      'k.kakaocdn.net',
      'ppongtok-app.vercel.app',
      'firebasestorage.googleapis.com',
    ],
  },
};

// PWA 관련 설정을 별도로 정의합니다.
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
};

// next-pwa 라이브러리를 불러옵니다.
const withPWA = require('next-pwa')(pwaConfig);

// withPWA 함수로 Next.js 설정을 감싸서 최종적으로 내보냅니다.
// 이 구조는 이전과 동일하지만, 설정을 분리하여 가독성과 안정성을 높입니다.
module.exports = withPWA(nextConfig);