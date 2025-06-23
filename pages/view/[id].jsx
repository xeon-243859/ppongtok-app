// ViewMessagePreviewPage 가 들어있는 파일의 전체 코드입니다.
// 기존 내용을 모두 지우고 아래 코드를 붙여넣으세요.

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// Firebase 관련 import 문을 수정합니다.
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../src/firebase"; // storage를 함께 가져옵니다.

import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
    const router = useRouter();
    const { id } = router.query;
    const [previewData, setPreviewData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 이 부분은 기존과 동일합니다. (localStorage에서 데이터 불러오기)
    useEffect(() => {
        if (!router.isReady || id !== 'preview') return;
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
            data.imageUrls = images; // 여기에는 아직 Base64 데이터가 들어있습니다.
            data.videoUrl = null;
        } else if (type === 'video') {
            data.videoUrl = videoUrl;
            data.imageUrls = [];
        }
        setPreviewData(data);
    }, [router.isReady, id]);

    // 이미지 슬라이드 쇼 기능 (기존과 동일)
    useEffect(() => {
        if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % previewData.imageUrls.length);
            }, 3000);
            return () => clearInterval(intervalId);
        }
    }, [previewData]);


    // 🔥 여기가 핵심! handleShare 함수를 새 버전으로 교체했습니다.
    const handleShare = async () => {
        if (!previewData) return;
        setIsSaving(true);
        
        const dataToSave = { ...previewData };
        const newId = `msg_${Date.now()}`;

        try {
            // 타입이 'image'이고 업로드할 이미지가 있다면
            if (dataToSave.type === 'image' && dataToSave.imageUrls?.length > 0) {
                // Base64 이미지들을 Storage에 업로드하고 다운로드 URL로 변환
                const downloadUrls = await Promise.all(
                    dataToSave.imageUrls.map((base64, index) => {
                        const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
                        return uploadString(imageRef, base64, 'data_url')
                            .then(() => getDownloadURL(imageRef));
                    })
                );
                
                // 무거운 Base64 데이터를 가벼운 URL 주소로 교체
                dataToSave.imageUrls = downloadUrls;
            }

            // 가벼워진 최종 데이터를 Firestore에 저장
            const docRef = doc(db, "messages", newId);
            await setDoc(docRef, dataToSave);
            
            // 성공적으로 저장 후, 공유 페이지로 이동
            router.push(`/share/${newId}`);

        } catch (error) {
            console.error("🔥 Firestore 저장 오류:", error);
            alert("메시지를 저장하는 데 실패했습니다. 다시 시도해주세요.");
            setIsSaving(false);
        }
    };


    // 이 아래 return 문은 기존과 완전히 동일합니다.
    if (!previewData) {
        return <p className={styles.loadingText}>미리보기를 생성 중입니다...</p>;
    }

    return (
        <>
            <Head><title>메시지 미리보기</title></Head>
            <div className={styles["preview-container"]}>
                <h2 className={styles["preview-title"]}>✨ 생성된 메시지 미리보기</h2>
                <div className={styles["moving-box"]}>
                    {previewData.type === "video" && previewData.videoUrl && <video src={previewData.videoUrl} controls autoPlay loop muted className={styles["media-element"]} />}
                    {previewData.type === "image" && previewData.imageUrls?.length > 0 && (
                        <img key={currentImageIndex} src={previewData.imageUrls[currentImageIndex]} alt={`slide-${currentImageIndex}`} className={styles.slideImage} />
                    )}
                    {previewData.message && <div className={styles["caption-scroll-container"]}><div className={styles["caption-scroll"]}>{previewData.message}</div></div>}
                </div>
                {previewData.music && <audio src={previewData.music} controls autoPlay style={{ width: '90%', maxWidth: '500px', marginTop: '15px' }}/>}
                <div className={styles["preview-button-group"]}>
                    <button className={styles["preview-button"]} onClick={() => router.back()}>뒤로가기</button>
                    <button className={`${styles["preview-button"]} ${styles.highlight}`} onClick={handleShare} disabled={isSaving}>
                        {isSaving ? '저장 중...' : '공유하기'}
                    </button>
                </div>
            </div>
        </>
    )
}