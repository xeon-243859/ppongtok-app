import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/present.module.css";

const PLAY_DURATION = 30000; // 30초 재생

export default function PresentPage() {
  const [messageData, setMessageData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const router = useRouter();
  const { id } = router.query;
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // 메시지 데이터 불러오기
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const docRef = doc(db, "messages", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMessageData(docSnap.data());
      } else {
        router.push('/404');
      }
    };
    fetchData();
  }, [id, router]);

  // 미디어 컨트롤 및 슬라이드쇼 로직
  useEffect(() => {
    if (!messageData) return;

    // 1. 30초 재생 제한 타이머
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
    }, PLAY_DURATION);

    // 2. 이미지 슬라이드쇼 로직
    let slideInterval;
    if (messageData.type === 'image' && messageData.imageurls?.length > 1) {
      const slideDuration = PLAY_DURATION / messageData.imageurls.length;
      slideInterval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1));
      }, slideDuration);
    }
    
    // 컴포넌트 언마운트 시 타이머와 인터벌 정리
    return () => {
      clearTimeout(finishTimer);
      if (slideInterval) clearInterval(slideInterval);
    };
  }, [messageData]);
  
  // 이미지가 마지막 슬라이드를 넘어가면 종료 처리
  useEffect(() => {
      if (messageData?.imageurls && currentImageIndex >= messageData.imageurls.length) {
          setIsFinished(true);
          if (audioRef.current) audioRef.current.pause();
      }
  }, [currentImageIndex, messageData]);

  if (!messageData) {
    return <div className={styles["loading-container"]}>메시지를 불러오는 중...</div>;
  }

  // 종료 화면
  if (isFinished) {
    return (
      <div className={styles["finish-container"]}>
        <h2>메시지가 종료되었습니다.</h2>
        <p>소중한 마음이 잘 전달되었기를 바랍니다.</p>
        <div className={styles.buttonGroup}>
            <button onClick={() => router.push('/')} className={styles.actionButton}>처음으로</button>
            <button onClick={() => router.push(`/share/${id}`)} className={styles.actionButton}>공유하기</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>친구가 보낸 특별한 메시지</title>
        {/* OG 태그는 여기서도 유지하면 좋습니다 */}
      </Head>

      <div className={styles["present-container"]}>
        <div className={styles["moving-box"]}>
          {messageData.type === "video" && (
            <video ref={videoRef} src={messageData.videoUrl} autoPlay muted loop className={styles["media-element"]} />
          )}
          
          {messageData.type === "image" && messageData.imageurls?.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`slide-${index}`}
              className={`${styles.slideImage} ${index === currentImageIndex ? styles.active : ''}`}
            />
          ))}
          
          {/* ✅ 10. 흐르는 자막 (Marquee 효과) */}
          {messageData.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>{messageData.message}</div>
            </div>
          )}
        </div>
        
        {messageData.music && <audio ref={audioRef} src={messageData.music} autoPlay loop />}
      </div>
    </>
  );
}