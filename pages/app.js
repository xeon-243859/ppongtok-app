// pages/_app.js
import "@/styles/globals.css"; // 전역 CSS 파일이 있다면 (없으면 삭제해도 됨)
import { AuthProvider } from "@/contexts/AuthContext"; // Firebase 로그인 컨텍스트

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
