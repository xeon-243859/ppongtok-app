import { useEffect, useRef, useState } from "react";
import Head from "next/head";

export default function ViewMessagePage() {
  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // ✅ SDK 동적 로드 및 초기화
  useEffect(() => {
    const loadKakaoScript = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("kakao-sdk")) return resolve(); // 중복 방지

        const script = document.createElement("script");
        script.id = "kakao-sdk";
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    loadKakaoScript().then(() => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
        console.log("✅ Kakao SDK 초기화 완료");
      }
    });
  }, []);

  const handleKakaoShare = () => {
    console.log("✅ 공유 버튼 눌림");

    if (!window.Kakao || !window.Kakao.Share) {
      alert("카카오 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "뿅!톡 메시지",
        description: messageData.caption,
        imageUrl: messageData.media,
        link: {
          mobileWebUrl: `https://ppongtok-app.vercel.app/view/test01`,
          webUrl: `https://ppongtok-app.vercel.app/view/test01`,
        },
      },
      buttons: [
        {
          title: "메시지 보러가기",
          link: {
            mobileWebUrl: `https://ppongtok-app.vercel.app/view/test01`,
            webUrl: `https://ppongtok-app.vercel.app/view/test01`,
          },
        },
      ],
    });
  };

  // 테스트용 데이터
  useEffect(() => {
    setMessageData({
      caption: "이건 공유된 메시지입니다.",
      mediaType: "image",
      media: "https://via.placeholder.com/800x450?text=배경미디어",
      music: "/audio/spring.mp3",
    });
  }, []);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <title>메시지 보기</title>
      </Head>
      <div style={{ padding: 20 }}>
        <h2>📨 메시지 보기</h2>
        <div>
          <img src={messageData.media} style={{ width: "100%" }} />
          <p>{messageData.caption}</p>
        </div>
        <button onClick={handleKakaoShare}>카카오톡으로 공유하기</button>
        <audio ref={audioRef} src={messageData.music} autoPlay />
      </div>
    </>
  );
}
