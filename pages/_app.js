// pages/_app.js
import Head from "next/head";
import { AuthProvider } from "../src/contexts/AuthContext";

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
