import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

export default function ViewMessagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;

  useEffect(() => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init("4abf45cca92e802defcd2c15a6615155"); // ⚠️ 여기에 실제 JS 키 넣기
    console.log("✅ Kakao 초기화 완료");
  }
}, []);


// ✅ handleKakaoShare 함수 여기에 추가!
const handleKakaoShare = () => {
  if (!window.Kakao) {
    alert("카카오 SDK 로드되지 않음");
    return;
  }

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: "뿅!톡 메시지",
      description: messageData.caption,
      imageUrl: messageData.media,
      link: {
        mobileWebUrl: `https://ppongtok-app.vercel.app/view/${id}`,
        webUrl: `https://ppongtok-app.vercel.app/view/${id}`,
      },
    },
    buttons: [
      {
        title: "메시지 보러가기",
        link: {
          mobileWebUrl: `https://ppongtok-app.vercel.app/view/${id}`,
          webUrl: `https://ppongtok-app.vercel.app/view/${id}`,
        },
      },
    ],
  });
};


    // ✅ 임시 데이터
    setMessageData({
      caption: "이건 공유된 메시지입니다.",
      mediaType: "image",
      media: "https://via.placeholder.com/800x450?text=배경미디어",
      music: "/audio/spring.mp3",
    });
  }, [id]);

  useEffect(() => {
    if (!messageData) return;

    const timeout = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [messageData]);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="beforeInteractive"></script>
      </Head>

      <div style={{ position: "relative", width: "100%", maxWidth: 800, margin: "auto", padding: 16 }}>
        <h2 style={{ textAlign: "center" }}>💌 메시지 보기</h2>

        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "24px",
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          {messageData.mediaType === "image" ? (
            <img
              src={messageData.media}
              alt="배경 이미지"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <video
              ref={videoRef}
              src={messageData.media}
              autoPlay
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          <div
            style={{
              position: "absolute",
              bottom: "10%",
              width: "100%",
              textAlign: "center",
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(0,0,0,0.8)",
            }}
          >
            {messageData.caption}
          </div>
        </div>
        <button
  onClick={handleKakaoShare}
  style={{
    marginTop: 24,
    padding: "12px 24px",
    backgroundColor: "#FEE500",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
  }}
>
  카카오톡으로 공유하기
</button>

        {messageData.music && (
          <audio ref={audioRef} src={messageData.music} autoPlay />
        )}

      </div>
    </>
  );
}
