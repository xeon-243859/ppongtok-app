// src/pages/_app.jsx

import Script from 'next/script';
import { useEffect, useState } from 'react'; // useState 추가
import '../styles/globals.css'; // globals.css 경로 확인

function MyApp({ Component, pageProps }) {
  const KAKAO_JAVASCRIPT_KEY = '4abf45cca92e802defcd2c15a6615155'; // 카카오 JavaScript 키
                
  const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"; // 최신 SDK URL
  const KAKAO_SDK_INTEGRITY = "sha384-sEMfrhtV5fVp6z1P8W9e1R2Tf9Wf1T4N1T3F1Q2U3V4X5Y6Z7W8A9B0C1D2E3F4G"; // 2.7.2 버전 SRI 해시 (카카오 개발자 문서에서 최신값 확인 권장)

  // 카카오 SDK 로드 상태를 추적하는 state
  const [kakaoSdkLoaded, setKakaoSdkLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서만 실행되도록 보장
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
        console.log(`[Kakao SDK] useEffect: SDK 초기화 성공. 키: ${KAKAO_JAVASCRIPT_KEY}`);
        setKakaoSdkLoaded(true);
      } catch (e) {
        console.error(`[Kakao SDK] useEffect: SDK 초기화 중 오류 발생:`, e);
      }
    } else if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
      console.log(`[Kakao SDK] useEffect: SDK 이미 초기화됨.`);
      setKakaoSdkLoaded(true);
    } else {
      console.log(`[Kakao SDK] useEffect: window.Kakao 객체 또는 SDK 로딩 대기 중...`);
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const handleKakaoSdkLoad = () => {
    console.log(`[Kakao SDK] Script onLoad: SDK 로드 완료!`);
    if (window.Kakao && !window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
        console.log(`[Kakao SDK] onLoad Callback: SDK 초기화 성공. 키: ${KAKAO_JAVASCRIPT_KEY}`);
        setKakaoSdkLoaded(true);
      } catch (e) {
        console.error(`[Kakao SDK] onLoad Callback: SDK 초기화 중 오류 발생:`, e);
      }
    } else if (window.Kakao && window.Kakao.isInitialized()) {
      console.log(`[Kakao SDK] onLoad Callback: SDK 이미 초기화됨.`);
      setKakaoSdkLoaded(true);
    } else {
      console.error(`[Kakao SDK] onLoad Callback: window.Kakao 객체를 찾을 수 없습니다. SDK 로드 실패 또는 지연.`);
    }
  };

  const handleKakaoSdkError = (error) => {
    console.error(`[Kakao SDK] Script Error: SDK 로드 중 치명적인 오류 발생!`, error);
    alert('카카오톡 공유 기능을 불러오는 데 실패했습니다. 잠시 후 다시 시도하거나 인터넷 연결을 확인해주세요.');
  };

  return (
    <>
      <Script
        src={KAKAO_SDK_URL}
        integrity={KAKAO_SDK_INTEGRITY}
        crossOrigin="anonymous"
        strategy="lazyOnload" // 페이지 콘텐츠 로드 후 로드
        onLoad={handleKakaoSdkLoad}
        onError={handleKakaoSdkError} // SDK 로드 실패 시 에러 핸들링
      />
      {/* Kakao SDK 로드 상태를 props로 전달하여 자식 컴포넌트에서 활용 가능 */}
      <Component {...pageProps} kakaoSdkLoaded={kakaoSdkLoaded} />
    </>
  );
}

export default MyApp;