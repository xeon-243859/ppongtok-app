// pages/view/[id].jsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ViewMessagePreviewPage() {
  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // ✅ 실제 Firebase에서 불러오는 부분으로 나중에 대체 가능
    setMessageData({
      caption: "이건 미리보기 메시지입니다.",
      mediaType: "image", // 또는 'video'
      media: "https://via.placeholder.com/800x450?text=미리보기",
      music: "/audio/spring.mp3",
    });
  }, []);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <title>미리보기</title>
      </Head>
      <div className="preview-container">
        <div className="media-box">
          {messageData.mediaType === "video" ? (
            <video src={messageData.media} controls className="media-element" />
          ) : (
            <img src={messageData.media} alt="미리보기" className="media-element" />
          )}
          <p className="caption">{messageData.caption}</p>
        </div>

        <div className="button-group">
          <button className="nav-button" onClick={() => router.back()}>
            ⬅ 뒤로가기
          </button>
          <button className="nav-button" onClick={() => router.push("/")}>🏠 처음으로</button>
          <button className="nav-button" onClick={() => router.push(`/share/${id}`)}>
            📤 공유하기
          </button>
        </div>

        <audio ref={audioRef} src={messageData.music} autoPlay />
      </div>
    </>
  );
}
