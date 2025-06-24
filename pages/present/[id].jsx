import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/present.module.css";

const PLAY_DURATION = 30000;

export default function PresentPage() {
    const [messageData, setMessageData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const audioRef = useRef(null);
    const videoRef = useRef(null);

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

    useEffect(() => {
        if (!messageData) return;
        const finishTimer = setTimeout(() => {
            setIsFinished(true);
            if (audioRef.current) audioRef.current.pause();
            if (videoRef.current) videoRef.current.pause();
        }, PLAY_DURATION);

        let slideInterval;
        if (messageData.type === 'image' && messageData.imageurls?.length > 1) {
            const slideDuration = PLAY_DURATION / messageData.imageurls.length;
            slideInterval = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1));
            }, slideDuration);
        }
        
        return () => {
            clearTimeout(finishTimer);
            if (slideInterval) clearInterval(slideInterval);
        };
    }, [messageData]);
    
    useEffect(() => {
        if (messageData?.imageurls && currentImageIndex >= messageData.imageurls.length) {
            setIsFinished(true);
            if (audioRef.current) audioRef.current.pause();
        }
    }, [currentImageIndex, messageData]);

    if (!messageData) {
        return <div className={styles["loading-container"]}>메시지를 불러오는 중...</div>;
    }

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
            <Head><title>친구가 보낸 특별한 메시지</title></Head>
            <div className={styles["present-container"]}>
                <div className={styles["moving-box"]}>
                    {messageData.type === "video" && <video ref={videoRef} src={messageData.videoUrl} autoPlay muted loop className={styles["media-element"]} />}
                    {messageData.type === "image" && messageData.imageurls?.length > 0 && (
                        <img key={currentImageIndex} src={messageData.imageurls[currentImageIndex]} alt={`slide-${currentImageIndex}`} className={styles.slideImage} />
                    )}
                    {messageData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{messageData.message}</div></div>}
                </div>
                {messageData.music && <audio ref={audioRef} src={messageData.music} autoPlay loop />}
            </div>
        </>
    )
}

