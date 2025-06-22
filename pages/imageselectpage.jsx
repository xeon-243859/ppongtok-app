// ppongtok-app/pages/imageselectpage.jsx (최종 진단 및 수정 완료)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css";

const getStorageKey = (index) => `ppong_image_${index}`;
const NEW_THEME_IMAGE_KEY = 'newly_selected_theme_image';

export default function ImageSelectPage() {
    const router = useRouter();
    const fileInputRef = useRef(null); // 'fileInputRef' 이름 확인
    const [images, setImages] = useState(Array(4).fill(null));
    const [isLoading, setIsLoading] = useState(false);

    // [핵심 진단] '내 파일 선택' 버튼을 클릭했을 때 실행되는 최종 함수
    const handleMyFileButtonClick = () => {
        // 이 경고창이 뜨면, 클릭 이벤트는 100% 성공한 것입니다.
        alert("버튼 클릭 성공!"); 
        
        if (fileInputRef.current) {
            fileInputRef.current.click();
        } else {
            alert("오류: ref가 input 태그에 연결되지 않았습니다.");
        }
    };
    
    // 이 밑으로는 수정할 필요 없습니다. (생략)
    useEffect(() => { try { let currentImages = Array(4).fill(null).map((_, i) => localStorage.getItem(getStorageKey(i))); const newThemeImage = localStorage.getItem(NEW_THEME_IMAGE_KEY); if (newThemeImage) { const firstEmptyIndex = currentImages.findIndex(img => !img); if (firstEmptyIndex !== -1) { currentImages[firstEmptyIndex] = newThemeImage; localStorage.setItem(getStorageKey(firstEmptyIndex), newThemeImage); } else { alert("더 이상 이미지를 추가할 수 없습니다."); } localStorage.removeItem(NEW_THEME_IMAGE_KEY); } setImages(currentImages); } catch (error) { console.error("이미지 로딩 중 오류:", error); localStorage.removeItem(NEW_THEME_IMAGE_KEY); } }, []);
    const selectedImageCount = images.filter(Boolean).length;
    const handleImageSelect = async (e) => { const files = e.target.files; if (!files || files.length === 0) return; const availableSlots = 4 - selectedImageCount; if (availableSlots <= 0) return; const filesToProcess = Array.from(files).slice(0, availableSlots); setIsLoading(true); alert("이미지 최적화를 시작합니다."); const compressedBase64s = await Promise.all(filesToProcess.map(async (file) => { try { const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true }; const compressedFile = await imageCompression(file, options); return new Promise(resolve => { const reader = new FileReader(); reader.readAsDataURL(compressedFile); reader.onloadend = () => resolve(reader.result); }); } catch (err) { return null; } })); const newImages = [...images]; let urlIndex = 0; for (let i = 0; i < newImages.length && urlIndex < compressedBase64s.length; i++) { if (!newImages[i] && compressedBase64s[urlIndex]) { const url = compressedBase64s[urlIndex++]; newImages[i] = url; localStorage.setItem(getStorageKey(i), url); } } setImages(newImages); setIsLoading(false); e.target.value = null; };
    const handleDelete = (index) => { const updatedImages = [...images]; updatedImages[index] = null; setImages(updatedImages); localStorage.removeItem(getStorageKey(index)); };
    const handleNext = () => { if (selectedImageCount === 0) { alert("최소 1장의 이미지를 선택해주세요."); return; } localStorage.setItem("selected-type", "image"); localStorage.removeItem("selected-video"); router.push("/musicselectpage"); };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.title} style={{ minHeight: '8rem' }}><TypeAnimation sequence={["어떤 배경으로\n마음을 전해볼까요?", 2000, "최대 4장의 이미지를\n선택해주세요.", 4000]} wrapper="span" speed={50} cursor={true} style={{ whiteSpace: "pre-line", display: "inline-block" }} repeat={Infinity} /></h1>
                
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={() => router.push("/imagethemepage")}>테마 이미지 선택</button>
                     <button className={styles.button} onClick={() => alert('버튼 클릭이 인식되었습니다!')} disabled={isLoading || selectedImageCount >= 4}>
                        {isLoading ? "업로드 중..." : "내 파일 선택"}
                    </button>
                </div>

                {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼ [수정된 부분] ▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
                <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleImageSelect} />
                {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲ [수정된 부분] ▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

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