// pages/messages/ViewMessagePreviewPage.js
// 기존 내용을 모두 지우고 아래 코드를 붙여넣으세요.

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// Firebase 관련 import 문
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../src/firebase";

import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
    const router = useRouter();
    const { id } = router.query;
    const [previewData, setPreviewData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // localStorage에서 미리보기 데이터를 불러오는 로직 (기존과 동일, 문제 없음)
    useEffect(() => {
        if (!router.isReady || id !== 'preview') return;

        const type = localStorage.getItem('selected-type');
        const message = localStorage.getItem('message');
        const musicSrc = localStorage.getItem('selected_music_src');
        const videoUrl = localStorage.getItem('selected-video');

        const data = {
            type,
            message, // Firestore에 'message' 필드로 저장됩니다.
            music: musicSrc,
            imageUrls: [],
            videoUrl: null,
            createdAt: new Date()
        };

        if (type === 'image') {
            const images = [];
            for (let i = 0; i < 4; i++) {
                // 이 부분에서 console.log(img)를 찍어 Base64 데이터가 정상적인지 확인해보세요.
                // "data:image/jpeg;base64,..." 와 같은 형식이어야 합니다.
                const img = localStorage.getItem(`ppong_image_${i}`);
                if (img) images.push(img);
            }
            data.imageUrls = images;
            data.videoUrl = null;
        } else if (type === 'video') {
            data.videoUrl = videoUrl;
            data.imageUrls = [];
        }
        setPreviewData(data);
    }, [router.isReady, id]);

    // 이미지 슬라이드 쇼 기능 (기존과 동일, 이 로직은 완벽합니다!)
    useEffect(() => {
        if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % previewData.imageUrls.length);
            }, 3000); // 3초마다 이미지 변경
            return () => clearInterval(intervalId);
        }
    }, [previewData]);

    // 공유하기 버튼 클릭 시 실행되는 함수 (기존과 동일, 문제 없음)
    const handleShare = async () => {
        if (!previewData) return;
        setIsSaving(true);
        
        const dataToSave = { ...previewData };
        const newId = `msg_${Date.now()}`;

        try {
            // 타입이 'image'이고 업로드할 이미지가 있는 경우
            if (dataToSave.type === 'image' && dataToSave.imageUrls?.length > 0) {
                // Base64 이미지들을 Storage에 업로드하고 다운로드 URL로 변환
                const downloadUrls = await Promise.all(
                    dataToSave.imageUrls.map((base64, index) => {
                        const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
                        return uploadString(imageRef, base64, 'data_url')
                            .then(() => getDownloadURL(imageRef));
                    })
                );
                
                // Firestore에 저장할 데이터의 imageUrls를 다운로드 URL 배열로 교체
                dataToSave.imageUrls = downloadUrls;
            }

            // 최종 데이터를 Firestore에 저장
            const docRef = doc(db, "messages", newId);
            await setDoc(docRef, dataToSave);
            
            // 성공적으로 저장 후, 생성된 id를 가진 공유 페이지로 이동
            router.push(`/share/${newId}`);

        } catch (error) {
            console.error("🔥 Firestore 저장 또는 이미지 업로드 오류:", error);
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
                
                {/* ✅ 문제 2번 해결 가이드: 아래 moving-box의 자식 요소로 영상/이미지가 들어갑니다. */}
                {/* ✅ src/styles/viewpreview.module.css 파일에 .slideImage 스타일을 추가/수정해야 합니다. */}
                <div className={styles["moving-box"]}>
                    {previewData.type === "video" && previewData.videoUrl && (
                        <video src={previewData.videoUrl} controls autoPlay loop muted className={styles["media-element"]} />
                    )}
                    {previewData.type === "image" && previewData.imageUrls?.length > 0 && (
                        // 이 img 태그 자체는 문제가 없습니다. CSS를 확인하세요!
                        <img 
                            key={currentImageIndex} 
                            src={previewData.imageUrls[currentImageIndex]} 
                            alt={`slide-${currentImageIndex}`} 
                            className={styles.slideImage} 
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
    )
}