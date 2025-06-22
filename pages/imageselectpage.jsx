// ppongtok-app/pages/imageselectpage.jsx

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css";

// 앱 전체에서 사용할 일관된 키
const getStorageKey = (index) => `ppong_image_${index}`;
const NEW_THEME_IMAGE_KEY = 'newly_selected_theme_image'; // 테마페이지에서 받아오는 임시 키

export default function ImageSelectPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [images, setImages] = useState(Array(4).fill(null));
    const [isLoading, setIsLoading] = useState(false);

    // 페이지가 로드될 때 실행되어 이미지 상태를 최종 설정합니다.
    useEffect(() => {
        try {
            // 1. 기존에 영구 저장된 이미지를 불러옵니다.
            let currentImages = Array(4).fill(null).map((_, i) => localStorage.getItem(getStorageKey(i)));

            // 2. [핵심 변경] 테마 페이지에서 새로 선택한 이미지가 있는지 확인합니다.
            const newThemeImage = localStorage.getItem(NEW_THEME_IMAGE_KEY);
            if (newThemeImage) {
                // 비어있는 첫 번째 슬롯의 인덱스를 찾습니다.
                const firstEmptyIndex = currentImages.findIndex(img => !img);
                
                if (firstEmptyIndex !== -1) {
                    // 빈 슬롯이 있으면, 이미지를 채워넣고 영구 저장합니다.
                    currentImages[firstEmptyIndex] = newThemeImage;
                    localStorage.setItem(getStorageKey(firstEmptyIndex), newThemeImage);
                } else {
                    alert("더 이상 이미지를 추가할 수 없습니다.");
                }
                
                // 사용이 끝난 임시 키는 반드시 즉시 삭제합니다.
                localStorage.removeItem(NEW_THEME_IMAGE_KEY);
            }
            setImages(currentImages);
        } catch (error) {
            console.error("이미지 로딩 중 오류:", error);
            localStorage.removeItem(NEW_THEME_IMAGE_KEY); // 오류 시에도 임시키 삭제
        }
    }, []);

    const selectedImageCount = images.filter(Boolean).length;

    const handleImageSelect = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const availableSlots = 4 - selectedImageCount;
        if (availableSlots <= 0) return;
        const filesToProcess = Array.from(files).slice(0, availableSlots);

        setIsLoading(true);
        alert("이미지 최적화를 시작합니다.");
        const compressedBase64s = await Promise.all(filesToProcess.map(async (file) => {
            try {
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();
                return new Promise(resolve => {
                    reader.readAsDataURL(compressedFile);
                    reader.onloadend = () => resolve(reader.result);
                });
            } catch (err) { return null; }
        }));
        
        const newImages = [...images];
        let urlIndex = 0;
        for (let i = 0; i < newImages.length && urlIndex < compressedBase64s.length; i++) {
            if (!newImages[i] && compressedBase64s[urlIndex]) {
                const url = compressedBase64s[urlIndex++];
                newImages[i] = url;
                localStorage.setItem(getStorageKey(i), url);
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
        localStorage.removeItem(getStorageKey(index));
    };

    const handleNext = () => {
        if (selectedImageCount === 0) {
            alert("최소 1장의 이미지를 선택해주세요.");
            return;
        }
        localStorage.setItem("selected-type", "image");
        localStorage.removeItem("selected-video");
        router.push("/musicselectpage");
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.title} style={{ minHeight: '8rem' }}>
                    <TypeAnimation sequence={["어떤 배경으로\n마음을 전해볼까요?", 2000, "최대 4장의 이미지를\n선택해주세요.", 4000]} wrapper="span" speed={50} cursor={true} style={{ whiteSpace: "pre-line", display: "inline-block" }} repeat={Infinity} />
                </h1>
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={() => router.push("/imagethemepage")}>테마 이미지 선택</button>
                    {/* [수정] '내 파일 선택' 버튼 클릭 핸들러 수정 */}
                    <button className={styles.button} onClick={() => fileInputRef.current?.click()} disabled={isLoading || selectedImageCount >= 4}>
                        {isLoading ? "업로드 중..." : "내 파일 선택"}
                    </button>
                </div>
                {/* [수정] input 태그에 ref가 정확히 연결되도록 함 */}
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
                                <div className={styles.placeholder} onClick={() => !isLoading && selectedImageCount < 4 && fileInputRef.current?.click()}>
                                    <span className={styles.plusIcon}>+</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.navButtonContainer}>
                <button onClick={() => router.push("/style-select")} className={`${styles.button} ${styles.navButton}`}>뒤로가기</button>
                {/* [수정] '다음으로' 버튼 정상 작동 확인 */}
                <button onClick={handleNext} className={`${styles.button} ${styles.navButton} ${styles.buttonPrimary}`} disabled={selectedImageCount === 0}>
                    다음으로
                </button>
            </div>
        </div>
    );
}