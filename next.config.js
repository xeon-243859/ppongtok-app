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

// withPWA로 감싸는 부분 없이, 순수한 Next.js 설정만 내보냅니다.
module.exports = nextConfig;
