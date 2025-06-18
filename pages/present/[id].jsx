import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/present.module.css";

export default function PresentPage() {
  const [messageData, setMessageData] = useState(null);
  // 💡 [핵심 수정 1] 현재 보여줄 이미지의 순번(index)을 저장할 상태 추가
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
          router.push('/404');
        }
      } catch (error) {
        console.error("🔥 메시지 불러오기 오류:", error);
      }
    };
    fetchData();
  }, [router.isReady, id]);

  // 💡 [핵심 수정 2] 이미지를 자동으로 전환시키는 슬라이드쇼 로직
  useEffect(() => {
    // 이미지 데이터가 있고, 이미지 개수가 1개보다 많을 때만 슬라이드쇼를 실행합니다.
    if (messageData?.type === 'image' && messageData.imageurls?.length > 1) {
      // 3초마다 이미지를 변경합니다. (3000ms)
      const intervalId = setInterval(() => {
        setCurrentImageIndex(prevIndex => 
          (prevIndex + 1) % messageData.imageurls.length
        );
      }, 5000);

      // 컴포넌트가 사라질 때 setInterval을 정리하여 메모리 누수를 방지합니다.
      return () => clearInterval(intervalId);
    }
  }, [messageData]); // messageData가 로드되면 이 useEffect가 실행됩니다.

  if (!messageData) {
    return (
      <div className={styles["loading-container"]}>
        <p>메시지를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>친구가 보낸 특별한 메시지</title>
        <meta property="og:title" content="친구가 보낸 특별한 메시지" />
        <meta property="og:description" content={messageData.message || "영상/이미지 메시지를 확인해보세요!"} />
        <meta property="og:image" content={messageData.imageurls?.[0] || "/logo.png"} />
      </Head>

      <div className={styles["present-container"]}>
        <div className={styles["moving-box"]}>
          {/* 비디오일 경우 기존 로직 유지 */}
          {messageData.type === "video" && <video src={messageData.videoUrl} controls autoPlay muted loop className={styles["media-element"]} />}
          
          {/* 💡 [핵심 수정 3] 이미지일 경우 슬라이드쇼 렌더링 로직으로 변경 */}
          {messageData.type === "image" && messageData.imageurls?.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`slide-${index}`}
              // 현재 보여줄 이미지에만 'active' 클래스를 부여합니다.
              className={`${styles.slideImage} ${index === currentImageIndex ? styles.active : ''}`}
            />
          ))}

          {messageData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{messageData.message}</div></div>}
        </div>
        {messageData.music && <audio src={messageData.music} autoPlay loop />}
      </div>
    </>
  );
}