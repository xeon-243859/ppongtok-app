import Head from "next/head";
import { AuthProvider } from "../src/contexts/AuthContext"; // ✅ 정확하게 수정
import "../src/index.css";
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
        />
      </Head>

      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
