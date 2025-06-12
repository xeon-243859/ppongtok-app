import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
         />  
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


