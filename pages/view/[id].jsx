import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
  const [messageData, setMessageData] = useState(null);
  // 💡 [핵심 수정 1] 슬라이드쇼를 위한 상태 추가
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { id } = router.query;
  const audioRef = useRef(null);

  // 데이터 불러오기
  useEffect(() => {
    if (!router.isReady) return;
    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          console.log("❌ 메시지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("🔥 메시지 불러오기 오류:", error);
      }
    };
    fetchData();
  }, [router.isReady, id]);

  // 💡 [핵심 수정 2] 이미지를 자동으로 전환시키는 슬라이드쇼 로직
  useEffect(() => {
    if (messageData?.type === 'image' && messageData.imageurls?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex(prevIndex =>
          (prevIndex + 1) % messageData.imageurls.length
        );
      }, 3000); // 3초마다 이미지 변경
      return () => clearInterval(intervalId);
    }
  }, [messageData]);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <title>미리보기</title>
      </Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>✨ 생성된 메시지 미리보기</h2>

        <div className={styles["moving-box"]}>
          {/* 🎥 영상 */}
          {messageData.type === "video" && messageData.videoUrl && (
            <video src={messageData.videoUrl} controls autoPlay className={styles["media-element"]} />
          )}

          {/* 💡 [핵심 수정 3] 이미지 렌더링 로직 수정 (경로 문제 해결 + 슬라이드쇼 적용) */}
          {messageData.type === "image" && messageData.imageurls?.map((imgUrl, index) => (
            <img
              key={index}
              // Firebase에 저장된 일반 경로('/...')도 처리할 수 있도록 수정
              src={imgUrl}
              alt={`slide-${index}`}
              className={`${styles.slideImage} ${index === currentImageIndex ? styles.active : ''}`}
            />
          ))}

          {/* 💬 자막 */}
          {messageData.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>{messageData.message}</div>
            </div>
          )}
        </div>

        {/* 🎵 음악 */}
        {messageData.music && (
          <audio ref={audioRef} src={messageData.music} controls autoPlay style={{ width: '90%', maxWidth: '500px', marginTop: '15px' }}/>
        )}

        {/* 💡 [핵심 수정 4] 버튼 그룹에 새로운 CSS 클래스 적용 */}
        <div className={styles["preview-button-group"]}>
          <button className={styles["preview-button"]} onClick={() => router.back()}>
            뒤로가기
          </button>
          <button className={styles["preview-button"]} onClick={() => router.push("/")}>
            처음으로
          </button>
          <button
            className={`${styles["preview-button"]} ${styles.highlight}`} // 공유하기 버튼은 강조
            disabled={!router.isReady || !id}
            onClick={() => {
              if (router.isReady && id) {
                router.push(`/share/${id}`);
              }
            }}
          >
            공유하기
          </button>
        </div>
      </div>
    </>
  );
}