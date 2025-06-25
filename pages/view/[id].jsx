// pages/view/[id].jsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, setDoc, updateDoc } from "firebase/firestore"; // updateDoc 추가
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../src/firebase";
import styles from "../../src/styles/viewpreview.module.css";
import { useAuth } from "../../src/contexts/AuthContext"; // ✅ 1. AuthContext 불러오기

export default function ViewMessagePreviewPage() {
    const router = useRouter();
    const { id } = router.query;
    
    // ✅ 2. AuthContext에서 로그인 및 유저 DB 정보 가져오기
    const { user, dbUser, loading } = useAuth(); 

    const [previewData, setPreviewData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // isSaving -> isProcessing
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // localStorage에서 미리보기 데이터를 불러오는 로직 (기존과 동일, 문제 없음)
    useEffect(() => {
        if (!router.isReady || id !== 'preview') return;
        // ... (기존 localStorage 로딩 코드는 그대로 유지) ...
        const type = localStorage.getItem('selected-type');
        const message = localStorage.getItem('message');
        if (!type) {
            alert("필수 정보가 없어 메시지를 생성할 수 없습니다. 처음부터 다시 시도해주세요.");
            router.push('/');
            return;
        }
        const data = {
            type,
            message: message || '',
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
    }, [router.isReady, id, router]);

    // 이미지 슬라이드 기능 (기존과 동일, 문제 없음)
    useEffect(() => {
        if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % previewData.imageUrls.length);
            }, 3000);
            return () => clearInterval(intervalId);
        }
    }, [previewData]);

    // 🔥 3. 여기가 핵심! '공유하기' 버튼의 로직을 완전히 교체했습니다.
    const handleShare = async () => {
        setIsProcessing(true);

        // --- 조건 1: 로그인 여부 확인 ---
        if (!user) {
            alert("메시지를 저장하고 공유하려면 로그인이 필요해요!");
            // 로그인 후 이 페이지로 돌아오도록 localStorage에 현재 경로를 저장합니다.
            localStorage.setItem('afterLoginRedirect', router.asPath);
            router.push('/loginpage'); // loginpage.jsx 파일로 이동
            setIsProcessing(false); // 로딩 상태 해제
            return; // 함수 실행 중단
        }

        // --- 조건 2: 이용권 개수 확인 ---
        // AuthContext에서 dbUser 정보를 아직 불러오는 중이면 잠시 대기
        if (loading) {
            alert("사용자 정보를 확인 중입니다. 잠시 후 다시 시도해주세요.");
            setIsProcessing(false);
            return;
        }

        // 로그인했지만 DB 정보가 없는 예외 케이스 처리
        if (!dbUser) {
            alert("사용자 정보를 불러오는데 실패했습니다. 다시 로그인해주세요.");
            router.push('/loginpage');
            setIsProcessing(false);
            return;
        }
        
        // 필드 이름은 loginpage.jsx에서 저장한 'freePassRemaining'을 사용
        const hasTickets = dbUser.freePassRemaining > 0;

        if (!hasTickets) {
            alert("이용권이 모두 소진되었어요. 이용권을 먼저 구매해주세요!");
            router.push('/paymentpage'); // paymentpage.jsx 파일로 이동
            setIsProcessing(false);
            return;
        }

        // --- 모든 관문 통과: 실제 저장 로직 실행 ---
        try {
            if (!previewData) throw new Error("미리보기 데이터가 없습니다.");

            // 1. 이용권 1장 차감
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                freePassRemaining: dbUser.freePassRemaining - 1
            });
            console.log("✅ 이용권 1장 차감 완료");

            // 2. 메시지 데이터 준비 및 저장 (기존 로직 활용)
            const dataToSave = { 
                ...previewData,
                authorUid: user.uid, // 메시지 작성자 UID 추가
                authorName: user.displayName || '이름없음', // 작성자 이름 추가
             };
            const newId = `msg_${Date.now()}`;

            // 3. 이미지/영상 Storage에 업로드
            if (dataToSave.type === 'image' && dataToSave.imageUrls.length > 0) {
                const downloadUrls = await Promise.all(
                    dataToSave.imageUrls.map((base64, index) => {
                        const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
                        return uploadString(imageRef, base64, 'data_url')
                            .then(() => getDownloadURL(imageRef));
                    })
                );
                dataToSave.imageUrls = downloadUrls; // Base64를 URL로 교체
            }
            
            // 4. 최종 데이터를 Firestore에 저장
            const messageDocRef = doc(db, "messages", newId);
            await setDoc(messageDocRef, dataToSave);
            console.log("✅ Firestore에 메시지 저장 완료");
            
            // 5. 성공적으로 저장 후, 공유 페이지로 이동
            router.push(`/share/${newId}`);

        } catch (error) {
            console.error("🔥 최종 저장/공유 단계 오류:", error);
            alert("메시지를 저장하는 데 실패했습니다. 다시 시도해주세요. 문제가 계속되면 문의 바랍니다.");
            // 참고: 여기서 실패 시 차감된 이용권을 롤백하는 로직을 추가하면 더 완벽합니다.
        } finally {
            setIsProcessing(false);
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
                    {/* ... (미디어 표시 JSX는 기존과 동일) ... */}
                    {previewData.type === "video" && previewData.videoUrl && (
                        <video src={previewData.videoUrl} controls autoPlay loop muted className={styles["media-element"]} />
                    )}
                    {previewData.type === "image" && previewData.imageUrls.length > 0 && (
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
                    {/* ✅ 버튼 텍스트와 disabled 상태를 isProcessing으로 연결 */}
                    <button className={`${styles["preview-button"]} ${styles.highlight}`} onClick={handleShare} disabled={isProcessing}>
                        {isProcessing ? '처리 중...' : '공유하기'}
                    </button>
                </div>
            </div>
        </>
    );
}