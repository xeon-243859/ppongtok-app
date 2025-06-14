// pages/view/[id].jsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../../styles/viewpreview.module.css"; // ✅ CSS 모듈 import 추가

export default function ViewMessagePreviewPage() {
  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setMessageData({
      mediaType: "image", // 또는 'video'
      media: "https://via.placeholder.com/800x450?text=Preview",
      music: "/audio/spring.mp3",
    });
  }, []);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <title>미리보기</title>
      </Head>
      <div className={styles["preview-container"]}>
        <div className={styles["moving-box"]}>
          {messageData.mediaType === "video" ? (
            <video src={messageData.media} controls className={styles["media-element"]} />
          ) : (
            <img src={messageData.media} alt="미리보기" className={styles["media-element"]} />
          )}
        </div>

        <div className={styles["button-group"]}>
          <button className={styles["action-button"]} onClick={() => router.back()}>
            ⬅ 뒤로가기
          </button>
          <button className={styles["action-button"]} onClick={() => router.push("/")}>
            🏠 처음으로
          </button>
          <button className={styles["action-button"]} onClick={() => router.push(`/share/${id}`)}>
            📤 공유하기
          </button>
        </div>

        <audio ref={audioRef} src={messageData.music} autoPlay />
      </div>
    </>
  );
}
