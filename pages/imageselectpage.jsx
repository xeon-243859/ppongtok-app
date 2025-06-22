// ppongtok-app/pages/imageselectpage.jsx (최종 진단 및 해결 시도)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css";

const getStorageKey = (index) => `ppong_image_${index}`;
const NEW_THEME_IMAGE_KEY = 'newly_selected_theme_image';

export default function ImageSelectPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [images, setImages] = useState(Array(4).fill(null));
    const [isLoading, setIsLoading] = useState(false);

    // ▼▼▼▼▼ [새로운 해결책] 컴포넌트 마운트 후 문제의 iframe을 강제 제거 ▼▼▼▼▼
    useEffect(() => {
        // Firebase가 iframe을 삽입할 시간을 벌기 위해 아주 짧은 지연(100ms)을 줍니다.
        const timer = setTimeout(() => {
            // src에 'firebaseapp.com/__/auth/iframe'을 포함하는 iframe을 찾습니다.
            const firebaseIframe = document.querySelector('iframe[src*="firebaseapp.com/__/auth/iframe"]');
            
            if (firebaseIframe) {
                console.log("클릭을 방해하는 Firebase iframe을 찾았습니다. 강제로 숨깁니다.");
                alert("문제를 일으키는 요소를 찾아 수정했습니다. 버튼을 다시 테스트해주세요.");
                // iframe을 화면에서 완전히 보이지 않게 하고 이벤트도 받지 않게 합니다.
                firebaseIframe.style.display = 'none';
                firebaseIframe.style.pointerEvents = 'none';
            }
        }, 100);

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
    }, []);
    // ▲▲▲▲▲ [새로운 해결책] ▲▲▲▲▲

    const handleMyFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        } else {
            alert("오류: ref가 input 태그에 연결되지 않았습니다.");
        }
    };
    
    // (이 아래의 다른 함수들은 기존과 동일합니다)
    useEffect(() => { try { let currentImages = Array(4).fill(null).map((_, i) => localStorage.getItem(getStorageKey(i))); const newThemeImage = localStorage.getItem(NEW_THEME_IMAGE_KEY); if (newThemeImage) { const firstEmptyIndex = currentImages.findIndex(img => !img); if (firstEmptyIndex !== -1) { currentImages[firstEmptyIndex] = newThemeImage; localStorage.setItem(getStorageKey(firstEmptyIndex), newThemeImage); } else { alert("더 이상 이미지를 추가할 수 없습니다."); } localStorage.removeItem(NEW_THEME_IMAGE_KEY); } setImages(currentImages); } catch (error) { console.error("이미지 로딩 중 오류:", error); localStorage.removeItem(NEW_THEME_IMAGE_KEY); } }, []);
    const selectedImageCount = images.filter(Boolean).length;
    const handleImageSelect = async (e) => { const files = e.target.files; if (!files || files.length === 0) return; const availableSlots = 4 - selectedImageCount; if (availableSlots <= 0) return; const filesToProcess = Array.from(files).slice(0, availableSlots); setIsLoading(true); const compressedBase64s = await Promise.all(filesToProcess.map(async (file) => { try { const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true }; const compressedFile = await imageCompression(file, options); return new Promise(resolve => { const reader = new FileReader(); reader.readAsDataURL(compressedFile); reader.onloadend = () => resolve(reader.result); }); } catch (err) { return null; } })); const newImages = [...images]; let urlIndex = 0; for (let i = 0; i < newImages.length && urlIndex < compressedBase64s.length; i++) { if (!newImages[i] && compressedBase64s[urlIndex]) { const url = compressedBase64s[urlIndex++]; newImages[i] = url; localStorage.setItem(getStorageKey(i), url); } } setImages(newImages); setIsLoading(false); e.target.value = null; };
    const handleDelete = (index) => { const updatedImages = [...images]; updatedImages[index] = null; setImages(updatedImages); localStorage.removeItem(getStorageKey(index)); };
    const handleNext = () => { if (selectedImageCount === 0) { alert("최소 1장의 이미지를 선택해주세요."); return; } localStorage.setItem("selected-type", "image"); localStorage.removeItem("selected-video"); router.push("/musicselectpage"); };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.title} style={{ minHeight: '8rem' }}><TypeAnimation sequence={["어떤 배경으로\n마음을 전해볼까요?", 2000, "최대 4장의 이미지를\n선택해주세요.", 4000]} wrapper="span" speed={50} cursor={true} style={{ whiteSpace: "pre-line", display: "inline-block" }} repeat={Infinity} /></h1>
                
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={() => router.push("/imagethemepage")}>테마 이미지 선택</button>
                    <button className={styles.button} onClick={handleMyFileButtonClick} disabled={isLoading || selectedImageCount >= 4}>
                        {isLoading ? "업로드 중..." : "내 파일 선택"}
                    </button>
                </div>

                <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleImageSelect} />
                <div className={styles.previewGrid}>
                    {images.map((url, index) => (
                        <div key={index} className={styles.slot}>
                            {url ? (
                                <>
                                    <img src={url} alt={`선택된 이미지 ${index + 1}`} className={styles.thumbnail} />
                                    <button className={styles.deleteButton} onClick={() => handleDelete(index)}>×</button>
                                </>
                            ) : (
                                <div className={styles.placeholder} onClick={handleMyFileButtonClick}>
                                    <span className={styles.plusIcon}>+</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.navButtonContainer}><button onClick={() => router.push("/style-select")} className={`${styles.button} ${styles.navButton}`}>뒤로가기</button><button onClick={handleNext} className={`${styles.button} ${styles.navButton} ${styles.buttonPrimary}`} disabled={selectedImageCount === 0}>다음으로</button></div>
        </div>
    );
}