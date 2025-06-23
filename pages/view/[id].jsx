// ppongtok-app/pages/view/[id].jsx (미리보기/공유 로직 분리)

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc, setDoc } from "firebase/firestore"; // setDoc 추가
import { db } from "../../src/firebase";
import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [previewData, setPreviewData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // router.query가 준비될 때까지 기다림
    if (!router.isReady) return;

    // 'preview' 모드: localStorage에서 데이터를 읽어옴
    if (id === 'preview') {
      console.log("모드: 미리보기. localStorage에서 데이터를 불러옵니다.");
      const type = localStorage.getItem('selected-type');
      const message = localStorage.getItem('message');
      const musicSrc = localStorage.getItem('selected_music_src');
      
      const data = { type, message, music: musicSrc, imageUrls: [], videoUrl: null };

      if (type === 'image') {
        for (let i = 0; i < 4; i++) {
          const img = localStorage.getItem(`ppong_image_${i}`);
          if (img) data.imageUrls.push(img);
        }
      } else if (type === 'video') {
        data.videoUrl = localStorage.getItem('selected-video');
      }
      setPreviewData(data);
    } 
    // '공유' 모드: Firestore에서 데이터를 읽어옴 (이 부분은 present 페이지가 담당)
    // 이 페이지는 이제 미리보기 전용이므로, id가 preview가 아니면 오류 처리 가능
    else {
        // 지금은 이 페이지가 Firestore 데이터를 직접 보여주지 않으므로,
        // 나중에 present/[id].jsx 에서 Firestore 데이터를 처리합니다.
        // 여기서는 비워둡니다.
        console.log("모드: 공유. 이 페이지는 미리보기 전용입니다.");
    }
  }, [router.isReady, id]);

  useEffect(() => {
    if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % previewData.imageUrls.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [previewData]);

  // [수정] 공유하기 버튼 로직: Firestore에 저장하고 공유 페이지로 이동
  const handleShare = async () => {
    if (!previewData) return;
    setIsSaving(true);
    
    // 새로운 문서 ID를 미리 생성
    const newId = `msg_${new Date().getTime()}`;
    const docRef = doc(db, "messages", newId);

    try {
      await setDoc(docRef, {
        ...previewData,
        createdAt: new Date(),
      });
      
      console.log("Firestore에 저장 완료. 문서 ID: ", newId);
      alert("메시지가 저장되었습니다! 공유 페이지로 이동합니다.");
      router.push(`/share/${newId}`);

    } catch (error) {
      console.error("🔥 Firestore 저장 오류:", error);
      alert("메시지를 저장하는 데 실패했습니다. 다시 시도해주세요.");
      setIsSaving(false);
    }
  };

  if (!previewData) {
    return <p className={styles.loadingText}>미리보기를 생성 중입니다...</p>;
  }

  return (
    <>
      <Head><title>메시지 미리보기</title></Head>
      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>✨ 생성된 메시지 미리보기</h2>
        <div className={styles["moving-box"]}>
          {previewData.type === "video" && previewData.videoUrl && (
            <video src={previewData.videoUrl} controls autoPlay loop muted className={styles["media-element"]} />
          )}
          {previewData.type === "image" && previewData.imageUrls?.map((imgUrl, index) => (
            <img key={index} src={imgUrl} alt={`slide-${index}`} className={`${styles.slideImage} ${index === currentImageIndex ? styles.active : ''}`} />
          ))}
          {previewData.message && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>{previewData.message}</div>
            </div>
          )}
        </div>
        {previewData.music && (
          <audio src={previewData.music} controls autoPlay style={{ width: '90%', maxWidth: '500px', marginTop: '15px' }}/>
        )}
        <div className={styles["preview-button-group"]}>
          <button className={styles["preview-button"]} onClick={() => router.back()}>뒤로가기</button>
          <button className={`${styles["preview-button"]} ${styles.highlight}`} onClick={handleShare} disabled={isSaving}>
            {isSaving ? '저장 중...' : '공유하기'}
          </button>
        </div>
      </div>
    </>
  );
}