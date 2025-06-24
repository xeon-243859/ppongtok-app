// pages/preview/[id].js (또는 해당 파일 경로)

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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

    // 1. localStorage에서 데이터 불러오기 (기존과 거의 동일, 안정성 강화)
    useEffect(() => {
        if (!router.isReady) return;
        
        // 미리보기가 아닌 다른 id 접근 시 차단
        if (id !== 'preview') {
             router.replace('/'); 
             return;
        }

        try {
            const type = localStorage.getItem('selected-type');
            const message = localStorage.getItem('message');
            const music = localStorage.getItem('selected_music_src');
            
            const data = { 
                type, 
                message, 
                music, 
                imageUrls: [], // ✨ 필드명을 imageUrls (camelCase)로 통일
                videoUrl: null, 
                createdAt: new Date().toISOString() 
            };

            if (type === 'image') {
                const images = [];
                for (let i = 0; i < 4; i++) {
                    const img = localStorage.getItem(`ppong_image_${i}`);
                    if (img) images.push(img);
                }
                data.imageUrls = images; // Base64 이미지 데이터 배열
            } else if (type === 'video') {
                data.videoUrl = localStorage.getItem('selected-video');
            }
            setPreviewData(data);
        } catch (error) {
            console.error("로컬 스토리지 데이터 로딩 실패:", error);
            alert("미리보기 데이터를 불러오는 데 실패했습니다.");
            router.push('/');
        }
    }, [router.isReady, id, router]);

    // 2. 이미지 슬라이드 쇼 기능 (다른 페이지와 통일된 로직)
    useEffect(() => {
        if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % previewData.imageUrls.length);
            }, 3000);
            return () => clearInterval(intervalId);
        }
    }, [previewData]);

    // 3. ✨ 공유하기 함수 (핵심 로직은 유지, 안정성 보강)
    const handleShare = async () => {
        if (!previewData || isSaving) return;
        setIsSaving(true);
        
        // Firestore에 저장할 데이터 복사
        const dataToSave = { ...previewData };
        const newId = `msg_${Date.now()}`;

        try {
            // 타입이 'image'이고 업로드할 이미지가 있을 경우
            if (dataToSave.type === 'image' && dataToSave.imageUrls?.length > 0) {
                // Base64 이미지들을 Storage에 업로드하고 다운로드 URL로 변환하는 작업을 병렬 처리
                const downloadUrls = await Promise.all(
                    dataToSave.imageUrls.map((base64, index) => {
                        const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
                        // Base64 데이터를 Storage에 업로드
                        return uploadString(imageRef, base64, 'data_url')
                            .then(() => getDownloadURL(imageRef)); // 업로드 후 다운로드 URL 가져오기
                    })
                );
                
                // Firestore에는 가벼운 URL 주소 배열로 교체하여 저장
                dataToSave.imageUrls = downloadUrls;
            }

            // 최종 데이터를 Firestore에 저장
            const docRef = doc(db, "messages", newId);
            await setDoc(docRef, dataToSave);
            
            // 성공적으로 저장 후, 공유 페이지로 이동
            router.push(`/share/${newId}`);

        } catch (error) {
            console.error("❌ Firestore 저장 또는 이미지 업로드 오류:", error);
            alert("메시지를 저장하는 데 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
            setIsSaving(false);
        }
    };
    
    // --- 렌더링 부분 ---
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
                    {/* ✨ 슬라이드 로직 수정: fade-in/out 효과 적용 */}
                    {previewData.type === "image" && previewData.imageUrls?.length > 0 && (
                         <div className={styles.slideContainer}>
                            {previewData.imageUrls.map((url, index) => (
                                <img 
                                    key={index}
                                    src={url} // Base64 데이터도 src에서 바로 렌더링 가능
                                    alt={`slide-${index}`} 
                                    className={`${styles.slideImage} ${currentImageIndex === index ? styles.visible : ''}`}
                                />
                            ))}
                        </div>
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
    );
}