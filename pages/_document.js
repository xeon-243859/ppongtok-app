// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 카카오 SDK */}
        <script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
        ></script>

        {/* 감성 글씨체 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap"
          rel="stylesheet"
        />

        {/* OG 메타태그 (공유용) */}
        <meta property="og:title" content="감정을 담은 뿅!톡 메시지" />
        <meta
          property="og:description"
          content="내 마음을 전하는 감성 메시지를 확인해보세요 💌"
        />
        <meta
          property="og:image"
          content="https://ppongtok-app.vercel.app/images/category_apology.jpg"
        />
        <meta
          property="og:url"
          content="https://ppongtok-app.vercel.app/share"
        />
        <meta property="og:type" content="website" />

        {/* 필수 메타 */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>뿅!톡</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
