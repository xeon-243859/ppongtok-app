// ppongtok-app/pages/imageselectpage.jsx (데이터 저장 로직 보강)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css";

const getStorageKey = (index) => `ppong_image_${index}`;

export default function ImageSelectPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [images, setImages] = useState(Array(4).fill(null));
    const [isLoading, setIsLoading] = useState(false);

    // 페이지 로드 시, localStorage 및 테마 이미지 확인
    useEffect(() => { 
        if (typeof window !== 'undefined') {
            try { 
                const currentImages = Array(4).fill(null).map((_, i) => localStorage.getItem(getStorageKey(i)));
                const newThemeImage = localStorage.getItem('newly_selected_theme_image'); 
                if (newThemeImage) { 
                    const firstEmptyIndex = currentImages.findIndex(img => !img); 
                    if (firstEmptyIndex !== -1) { 
                        currentImages[firstEmptyIndex] = newThemeImage; 
                    } else { 
                        alert("더 이상 이미지를 추가할 수 없습니다."); 
                    } 
                    localStorage.removeItem('newly_selected_theme_image'); 
                } 
                setImages(currentImages); 
            } catch (error) { 
                console.error("이미지 로딩 중 오류:", error); 
                localStorage.removeItem('newly_selected_theme_image'); 
            }
        }
    }, []);

    // images 상태가 변경될 때마다 localStorage에 자동 저장
    useEffect(() => {
        if (typeof window !== 'undefined') {
            images.forEach((image, index) => {
                const key = getStorageKey(index);
                if (image) {
                    localStorage.setItem(key, image);
                } else {
                    localStorage.removeItem(key);
                }
            });
        }
    }, [images]);

    const selectedImageCount = images.filter(Boolean).length;
    const handleMyFileButtonClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };
    
    const handleImageSelect = async (e) => { 
        const files = e.target.files; 
        if (!files || files.length === 0) return; 
        const availableSlots = 4 - selectedImageCount; 
        if (availableSlots <= 0) { alert("이미지는 최대 4장까지 선택할 수 있습니다."); return; }
        const filesToProcess = Array.from(files).slice(0, availableSlots); 
        setIsLoading(true); 
        const compressedBase64s = await Promise.all(filesToProcess.map(async (file) => { 
            try { 
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true }; 
                const compressedFile = await imageCompression(file, options); 
                return new Promise(resolve => { 
                    const reader = new FileReader(); 
                    reader.readAsDataURL(compressedFile); 
                    reader.onloadend = () => resolve(reader.result); 
                }); 
            } catch (err) { return null; } 
        })); 
        const newImages = [...images]; 
        let urlIndex = 0; 
        for (let i = 0; i < newImages.length && urlIndex < compressedBase64s.length; i++) { 
            if (!newImages[i] && compressedBase64s[urlIndex]) { 
                newImages[i] = compressedBase64s[urlIndex++]; 
            } 
        } 
        setImages(newImages); 
        setIsLoading(false); 
        e.target.value = null; 
    };

    const handleDelete = (index) => { 
        const updatedImages = [...images]; 
        updatedImages[index] = null; 
        setImages(updatedImages); 
    };

    // [수정] handleNext 함수
    const handleNext = () => { 
        if (selectedImageCount === 0) { alert("최소 1장의 이미지를 선택해주세요."); return; } 
        try {
            console.log("[ImageSelect] 다음 단계로, localStorage에 저장 확인.");
            // images 상태가 변경될 때마다 저장하는 useEffect가 이미 역할을 하고 있으므로,
            // 여기서는 타입만 설정하고 넘어갑니다.
            localStorage.setItem("selected-type", "image");
            // 다른 타입의 미디어 정보는 확실하게 삭제
            localStorage.removeItem("selected-video");
            console.log("[ImageSelect] 타입 설정 완료, musicselectpage로 이동.");
            router.push("/musicselectpage");
        } catch(error) {
            console.error("localStorage 저장 실패:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.title}>
                    <TypeAnimation sequence={["어떤 배경으로\n마음을 전해볼까요?", 2000, "최대 4장의 이미지를\n선택해주세요.", 4000]} wrapper="span" speed={50} cursor={true} style={{ whiteSpace: "pre-line", display: "inline-block" }} repeat={Infinity} />
                </h1>
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={() => router.push("/imagethemepage")}>테마 이미지 선택</button>
                    <button className={styles.button} onClick={handleMyFileButtonClick} disabled={isLoading || selectedImageCount >= 4}>{isLoading ? "업로드 중..." : "내 파일 선택"}</button>
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
                                <div className={styles.placeholder} onClick={handleMyFileButtonClick}><span className={styles.plusIcon}>+</span></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.navButtonContainer}>
                <button onClick={() => router.push("/style-select")} className={styles.navButton}>뒤로가기</button>
                <button onClick={handleNext} className={`${styles.navButton} ${styles.primary}`} disabled={selectedImageCount === 0}>다음으로</button>
            </div>
        </div>
    );
}