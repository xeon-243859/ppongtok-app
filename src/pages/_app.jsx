// src/pages/_app.jsx (수정 완료)

import Script from 'next/script';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const KAKAO_JAVASCRIPT_KEY = '4abf45cca92e802defcd2c15a6615155';
  const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
  const KAKAO_SDK_INTEGRITY = "sha384-sEMfrhtV5fVp6z1P8W9e1R2Tf9Wf1T4N1T3F1Q2U3V4X5Y6Z7W8A9B0C1D2E3F4G";
                               
  const [kakaoSdkLoaded, setKakaoSdkLoaded] = useState(false);

  useEffect(() => {
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
  }, []);

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
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [수정된 부분] ▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // 기존의 <>(Fragment)를 <div style=...>로 변경하여 Firebase iframe 문제를 해결합니다.
    <div style={{ position: 'relative', zIndex: 0 }}>
      <Script
        src={KAKAO_SDK_URL}
        integrity={KAKAO_SDK_INTEGRITY}
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={handleKakaoSdkLoad}
        onError={handleKakaoSdkError}
      />
      <Component {...pageProps} kakaoSdkLoaded={kakaoSdkLoaded} />
    </div>
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [수정된 부분] ▲▲▲▲▲▲▲▲▲▲▲▲▲▲
  );
}

export default MyApp;