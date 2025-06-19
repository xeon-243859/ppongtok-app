// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드에서 React StrictMode를 비활성화합니다.
  // 이는 컴포넌트가 두 번 렌더링되는 것을 방지하여,
  // useEffect가 두 번 실행되는 등의 문제를 피하고 콘솔 메시지를 줄일 수 있습니다.
  // 프로덕션 빌드에는 영향을 미치지 않으며, 개발 편의성을 위한 설정입니다.
  reactStrictMode: false, // 개발 시 불필요한 이중 렌더링 방지 및 콘솔 클리어

  // SWC 컴파일러를 사용하여 JavaScript/TypeScript 코드를 더 빠르게 변환합니다.
  // 기본적으로 활성화되어 있지만 명시적으로 설정할 수 있습니다.
  swcMinify: true,

  // Next.js Image 컴포넌트 사용 시 허용할 외부 이미지 도메인을 명시합니다.
  // 이는 보안상의 이유로 필요하며, 카카오톡 공유 미리보기 이미지나
  // 앱 내에서 사용될 모든 외부 이미지 URL의 도메인을 여기에 추가해야 합니다.
  images: {
    domains: [
      'k.kakaocdn.net', // 카카오톡 공유 메시지에 사용될 수 있는 카카오 CDN 도메인
      'ppongtok-app.vercel.app', // 현재 앱이 배포될 Vercel 도메인 (또는 예정 도메인)
      // 만약 다른 이미지 호스팅 서비스를 사용한다면 해당 도메인을 여기에 추가합니다.
      // 예: 'example.com', 'another-image-cdn.net'
    ],
  },

  // 'appDir' 관련 경고를 해결합니다.
  // Next.js 13+에서 도입된 App Router (app/ 폴더)를 사용하지 않는 경우,
  // 'experimental: { appDir: true }' 설정을 제거하거나 주석 처리하는 것이 일반적입니다.
  // 만약 app/ 폴더를 사용할 계획이 없다면 이 설정을 제거하여 경고를 없앱니다.
  // App Router를 사용한다면 이 설정은 필요하며, 경우에 따라 다른 experimental 설정이 추가될 수 있습니다.
  // 현재 App Router를 명시적으로 사용하지 않는 것으로 가정하고 주석 처리하거나 제거를 고려합니다.
  // experimental: {
  //   appDir: true, // 이전에 경고가 떴던 부분. app/ 디렉토리를 사용하지 않으면 제거를 고려합니다.
  // },

  // PWA (Progressive Web App) 설정을 위한 workboxPluginMode와 disable 설정은
  // `next-pwa` 패키지를 사용할 때 여기에 추가될 수 있습니다.
  // 현재는 PWA 설정이 직접 코드에 포함되지 않았으므로 이 부분은 생략합니다.
  // 예시:
  /*
  webpack: (config) => {
    config.plugins.push(
      new GenerateSW({
        // WorkboxWebpackPlugin 설정
      })
    );
    return config;
  },
  */
};

module.exports = nextConfig;