// ppongtok-app/pages/imageselectpage.jsx

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/imageselectpage.module.css";

// [수정] 앱 전체에서 사용할 일관된 키
const getStorageKey = (index) => `ppong_image_${index}`;
const THEME_IMAGES_KEY = 'theme_images_to_add';

export default function ImageSelectPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [images, setImages] = useState(Array(4).fill(null));
    const [isLoading, setIsLoading] = useState(false);

    // 페이지가 로드될 때 단 한 번만 실행되어 이미지 상태를 설정합니다.
    useEffect(() => {
        try {
            // 1. 기존에 영구 저장된 이미지를 불러옵니다.
            let currentImages = Array(4).fill(null).map((_, i) => localStorage.getItem(getStorageKey(i)));

            // 2. 테마 페이지에서 온 임시 이미지가 있는지 확인합니다.
            const themeImagesJSON = localStorage.getItem(THEME_IMAGES_KEY);
            if (themeImagesJSON) {
                const themeImagesToAdd = JSON.parse(themeImagesJSON);
                let themeIndex = 0;

                // 3. 비어있는 슬롯에 테마 이미지를 채워넣습니다.
                currentImages = currentImages.map((img, i) => {
                    if (!img && themeIndex < themeImagesToAdd.length) {
                        const newUrl = themeImagesToAdd[themeIndex++];
                        localStorage.setItem(getStorageKey(i), newUrl); // 영구 저장소에도 반영
                        return newUrl;
                    }
                    return img;
                });
                localStorage.removeItem(THEME_IMAGES_KEY); // 사용 후 즉시 삭제
            }
            setImages(currentImages);
        } catch (error) {
            console.error("이미지 로딩 중 오류:", error);
            localStorage.removeItem(THEME_IMAGES_KEY);
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
                    <TypeAnimation
                        sequence={["어떤 배경으로\n마음을 전해볼까요?", 2000, "최대 4장의 이미지를\n선택해주세요.", 4000]}
                        wrapper="span" speed={50} cursor={true}
                        style={{ whiteSpace: "pre-line", display: "inline-block" }} repeat={Infinity}
                    />
                </h1>
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={() => router.push("/imagethemepage")}>테마 이미지 선택</button>
                    <button className={styles.button} onClick={() => fileInputRef.current?.click()} disabled={isLoading || selectedImageCount >= 4}>
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
                                <div className={styles.placeholder} onClick={() => !isLoading && selectedImageCount < 4 && fileInputRef.current?.click()}>
                                    <span className={styles.plusIcon}>+</span>
                                    {/* [수정] "이미지 추가" 문구 삭제 */}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.navButtonContainer}>
                <button onClick={() => router.push("/style-select")} className={`${styles.button} ${styles.navButton}`}>뒤로가기</button>
                <button onClick={handleNext} className={`${styles.button} ${styles.navButton} ${styles.buttonPrimary}`} disabled={selectedImageCount === 0}>
                    다음으로
                </button>
            </div>
        </div>
    );
}