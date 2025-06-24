// pages/messages/ViewMessagePreviewPage.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../src/firebase"; // 🔥 경로가 올바른지 다시 한번 확인!
import styles from "../../src/styles/viewpreview.module.css"; // 🔥 경로가 올바른지 다시 한번 확인!

export default function ViewMessagePreviewPage() {
    const router = useRouter();
    const { id } = router.query;
    const [previewData, setPreviewData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // localStorage에서 데이터를 안전하게 불러옵니다.
    useEffect(() => {
        if (!router.isReady) return;

        try {
            if (id !== 'preview') return;

            const type = localStorage.getItem('selected-type');
            const message = localStorage.getItem('message');

            if (!type) {
                console.error("미리보기 오류: 'type' 데이터가 없습니다. 홈으로 이동합니다.");
                alert("필수 정보가 없어 메시지를 생성할 수 없습니다. 처음부터 다시 시도해주세요.");
                router.push('/');
                return;
            }

            const data = {
                type,
                message: message || '', // 메시지가 없는 경우를 대비
                music: localStorage.getItem('selected_music_src'),
                imageUrls: [],
                videoUrl: null,
                createdAt: new Date()
            };

            if (type === 'image') {
                const images = [];
                for (let i = 0; i < 4; i++) {
                    const img = localStorage.getItem(`ppong_image_${i}`);
                    if (img) images.push(img);
                }
                data.imageUrls = images;
            } else if (type === 'video') {
                data.videoUrl = localStorage.getItem('selected-video');
            }
            
            setPreviewData(data);
        } catch (error) {
            console.error("미리보기 데이터 로딩 중 심각한 오류 발생:", error);
            alert("미리보기를 로드하는 중 문제가 발생했습니다.");
            router.push('/');
        }
    }, [router.isReady, id, router]);

    // 이미지 슬라이드 기능
    useEffect(() => {
        if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % previewData.imageUrls.length);
            }, 3000);
            return () => clearInterval(intervalId);
        }
    }, [previewData]);

    // 공유하기 (Firebase에 저장)
    const handleShare = async () => {
        if (!previewData) return;
        setIsSaving(true);
        
        const dataToSave = { ...previewData };
        const newId = `msg_${Date.now()}`;

        try {
            if (dataToSave.type === 'image' && dataToSave.imageUrls?.length > 0) {
                const downloadUrls = await Promise.all(
                    dataToSave.imageUrls.map((base64, index) => {
                        const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
                        return uploadString(imageRef, base64, 'data_url')
                            .then(() => getDownloadURL(imageRef));
                    })
                );
                dataToSave.imageUrls = downloadUrls;
            }

            const docRef = doc(db, "messages", newId);
            await setDoc(docRef, dataToSave);
            
            router.push(`/share/${newId}`);

        } catch (error) {
            console.error("🔥 Firestore 저장 오류:", error);
            alert("메시지를 저장하는 데 실패했습니다. 다시 시도해주세요.");
        } finally {
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
                
                {/* ✅ 이미지 슬라이드가 안 보이는 문제는 아래 CSS를 확인해야 합니다. */}
                <div className={styles["moving-box"]}>
                    {previewData.type === "video" && previewData.videoUrl && (
                        <video src={previewData.videoUrl} controls autoPlay loop muted className={styles["media-element"]} />
                    )}
                    {previewData.type === "image" && previewData.imageUrls?.length > 0 && (
                        <img 
                            key={currentImageIndex} 
                            src={previewData.imageUrls[currentImageIndex]} 
                            alt={`slide-${currentImageIndex}`} 
                            className={styles.slideImage} // 이 클래스에 대한 스타일이 중요!
                        />
                    )}
                    {previewData.message && (
                        <div className={styles["caption-scroll-container"]}>
                            <div className={styles["caption-scroll"]}>{previewData.message}</div>
                        </div>
                    )}
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
    );
}