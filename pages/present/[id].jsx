import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/present.module.css"; // 💡 새로운 CSS 파일을 사용합니다.

export default function PresentPage() {
  const [messageData, setMessageData] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  // 메시지 데이터 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;
    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          // 받는 사람이 없는 메시지를 볼 경우를 대비
          router.push('/404');
        }
      } catch (error) {
        console.error("🔥 메시지 불러오기 오류:", error);
      }
    };
    fetchData();
  }, [router.isReady, id]);

  if (!messageData) {
    return (
      <div className={styles["loading-container"]}>
        <p>메시지를 불러오는 중...</p>
      </div>
    );
  }

  // 받는 사람이 볼 깔끔한 화면
  return (
    <>
      <Head>
        <title>친구가 보낸 특별한 메시지</title>
        {/* SNS 미리보기를 위한 메타 태그는 여기에도 필요합니다 */}
        <meta property="og:title" content="친구가 보낸 특별한 메시지" />
        <meta property="og:description" content={messageData.message || "영상 메시지를 확인해보세요!"} />
        <meta property="og:image" content={messageData.imageurls?.[0] || "/logo.png"} />
      </Head>

      <div className={styles["present-container"]}>
        {/* 💌 '친구가 보낸 메시지' 같은 제목도 뺄 수 있습니다. */}
        <div className={styles["moving-box"]}>
          {messageData.type === "video" && <video src={messageData.videoUrl} controls autoPlay muted loop className={styles["media-element"]} />}
          {messageData.type === "image" && messageData.imageurls?.map((img, i) => <img key={i} src={img} alt={`img-${i}`} className={styles["media-element"]} />)}
          {messageData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{messageData.message}</div></div>}
        </div>
        {messageData.music && <audio src={messageData.music} autoPlay controls style={{ width: '90%', maxWidth: '500px', marginTop: '15px' }} />}
      </div>
    </>
  );
}