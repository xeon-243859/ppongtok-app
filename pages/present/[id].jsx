// pages/present/[id].js

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/present.module.css";

const PLAY_DURATION = 30000; // 30초

export default function PresentPage() {
    const [messageData, setMessageData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    // 1. 데이터 불러오기
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            const docRef = doc(db, "messages", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setMessageData(docSnap.data());
            } else {
                router.push('/404'); // 404 페이지로 보내는 것이 더 적절
            }
        };
        fetchData();
    }, [id, router]);

    // 2. 재생 및 타이머 로직
    useEffect(() => {
        if (!messageData) return;

        // 전체 재생 시간 타이머
        const finishTimer = setTimeout(() => {
            setIsFinished(true);
        }, PLAY_DURATION);

        // 이미지 슬라이드 타이머
        let slideInterval;
        // ❗️ 핵심 수정: 'imageurls' -> 'imageUrls'
        if (messageData.type === 'image' && messageData.imageUrls?.length > 1) {
            slideInterval = setInterval(() => {
                // 다음 이미지로 넘어감. 마지막 이미지면 0으로 돌아감.
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % messageData.imageUrls.length);
            }, 3000); // 3초마다 이미지 변경
        }
        
        // 컴포넌트가 언마운트되거나, 상태가 바뀌기 전에 타이머 정리
        return () => {
            clearTimeout(finishTimer);
            if (slideInterval) clearInterval(slideInterval);
        };
    }, [messageData]);
    
    // 3. 재생 종료 시 미디어 정지
    useEffect(() => {
        if(isFinished) {
            if (audioRef.current) audioRef.current.pause();
            if (videoRef.current) videoRef.current.pause();
        }
    }, [isFinished])


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
                    <button onClick={() => router.push(`/share/${id}`)} className={styles.actionButton}>나도 공유하기</button>
                </div>
            </div>
        );
    }

    // 재생 화면
    return (
        <>
            <Head><title>친구가 보낸 특별한 메시지</title></Head>
            <div className={styles["present-container"]}>
                <div className={styles["moving-box"]}>
                    {messageData.type === "video" && (
                        <video ref={videoRef} src={messageData.videoUrl} autoPlay muted loop className={styles["media-element"]} />
                    )}
                    {/* ❗️ 핵심 수정: 'imageurls' -> 'imageUrls' */}
                    {messageData.type === "image" && messageData.imageUrls?.length > 0 && (
                        // key를 currentImageIndex로 주면 이미지가 바뀔 때마다 태그가 새로 렌더링되어 fade-in/out 효과를 주기 용이
                        <img 
                          key={currentImageIndex} 
                          src={messageData.imageUrls[currentImageIndex]} 
                          alt={`slide-${currentImageIndex}`} 
                          className={styles.slideImage} 
                        />
                    )}
                    {messageData.message && (
                        <div className={styles["caption-scroll-container"]}>
                            <div className={styles["caption-scroll"]}>{messageData.message}</div>
                        </div>
                    )}
                </div>
                {messageData.music && <audio ref={audioRef} src={messageData.music} autoPlay loop />}
            </div>
        </>
    )
}