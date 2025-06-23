// ppongtok-app/pages/view/[id].jsx (최종)

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
    const router = useRouter();
    const { id } = router.query;
    const [previewData, setPreviewData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!router.isReady || id !== 'preview') return;
        
        console.log("[ViewPage] 미리보기 모드 시작. localStorage에서 데이터 로드.");
        const type = localStorage.getItem('selected-type');
        const message = localStorage.getItem('message');
        const musicSrc = localStorage.getItem('selected_music_src');
        const videoUrl = localStorage.getItem('selected-video');
        
        const data = { type, message, music: musicSrc, imageUrls: [], videoUrl: null, createdAt: new Date() };

        if (type === 'image') {
            const images = [];
            for (let i = 0; i < 4; i++) {
                const img = localStorage.getItem(`ppong_image_${i}`);
                if (img) images.push(img);
            }
            data.imageUrls = images;
            data.videoUrl = null; // 비디오 정보는 확실히 null 처리
        } else if (type === 'video') {
            data.videoUrl = videoUrl;
            data.imageUrls = []; // 이미지 정보는 확실히 빈 배열 처리
        }
        
        console.log("[ViewPage] 로드 완료된 미리보기 데이터:", data);
        setPreviewData(data);
        
    }, [router.isReady, id]);

    useEffect(() => {
        if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % previewData.imageUrls.length);
            }, 3000);
            return () => clearInterval(intervalId);
        }
    }, [previewData]);

    const handleShare = async () => {
        if (!previewData) return;
        setIsSaving(true);
        const newId = `msg_${Date.now()}`;
        const docRef = doc(db, "messages", newId);
        
        console.log("[ViewPage] Firestore에 저장할 데이터:", previewData);

        try {
            await setDoc(docRef, previewData);
            router.push(`/share/${newId}`);
        } catch (error) {
            console.error("🔥 Firestore 저장 오류:", error);
            alert("메시지 저장 실패. 다시 시도해주세요.");
            setIsSaving(false);
        }
    };

    if (!previewData) return <p className={styles.loadingText}>미리보기를 생성 중입니다...</p>;

    return (
        <>
            <Head><title>메시지 미리보기</title></Head>
            <div className={styles["preview-container"]}>
                <h2 className={styles["preview-title"]}>✨ 생성된 메시지 미리보기</h2>
                <div className={styles["moving-box"]}>
                    {previewData.type === "video" && previewData.videoUrl && <video src={previewData.videoUrl} controls autoPlay loop muted className={styles["media-element"]} />}
                    {previewData.type === "image" && previewData.imageUrls?.map((imgUrl, index) => <img key={index} src={imgUrl} alt={`slide-${index}`} className={`${styles.slideImage} ${index === currentImageIndex ? styles.active : ''}`} />)}
                    {previewData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{previewData.message}</div></div>}
                </div>
                {previewData.music && <audio src={previewData.music} controls autoPlay style={{ width: '90%', maxWidth: '500px', marginTop: '15px' }} />}
                <div className={styles["preview-button-group"]}>
                    <button className={styles["preview-button"]} onClick={() => router.back()}>뒤로가기</button>
                    <button className={`${styles["preview-button"]} ${styles.highlight}`} onClick={handleShare} disabled={isSaving}>{isSaving ? '저장 중...' : '공유하기'}</button>
                </div>
            </div>
        </>
    );
}