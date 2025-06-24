// ppongtok-app/pages/imageselectpage.jsx (최종 수정본)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import styles from "../src/styles/imageselectpage.module.css";

// ✨ 1. dynamic import를 불러옵니다.
import dynamic from 'next/dynamic';

// ✨ 2. TypeAnimation 컴포넌트를 dynamic import로 정의합니다.
// { ssr: false } 옵션이 핵심입니다. 이 컴포넌트는 서버에서 렌더링되지 않습니다.
const DynamicTypeAnimation = dynamic(() => 
    import('react-type-animation').then(mod => mod.TypeAnimation), 
    { ssr: false }
);

const getStorageKey = (index) => `ppong_image_${index}`;

export default function ImageSelectPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [images, setImages] = useState(Array(4).fill(null));
    const [isLoading, setIsLoading] = useState(false);

    // 페이지 로드 시 로직 (기존과 동일, 안정적)
    useEffect(() => { 
        // ... (기존 코드와 동일)
    }, []);

    // 이미지 상태 변경 시 로직 (기존과 동일, 안정적)
    useEffect(() => {
        // ... (기존 코드와 동일)
    }, [images]);

    const selectedImageCount = images.filter(Boolean).length;
    const handleMyFileButtonClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };
    
    const handleImageSelect = async (e) => { 
        // ... (기존 이미지 선택 핸들러 코드와 동일)
    };

    const handleDelete = (index) => { 
        // ... (기존 삭제 핸들러 코드와 동일)
    };

    // "다음으로" 버튼 핸들러 (기존과 동일, 안정적)
    const handleNext = () => { 
        if (selectedImageCount === 0) { alert("최소 1장의 이미지를 선택해주세요."); return; } 
        try {
            localStorage.setItem("selected-type", "image");
            localStorage.removeItem("selected-video");
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
                    {/* ✨ 3. 기존 TypeAnimation을 DynamicTypeAnimation으로 교체합니다. */}
                    <DynamicTypeAnimation 
                        sequence={[
                            "어떤 배경으로\n마음을 전해볼까요?", 2000, 
                            "최대 4장의 이미지를\n선택해주세요.", 4000
                        ]} 
                        wrapper="span" 
                        speed={50} 
                        cursor={true} 
                        style={{ whiteSpace: "pre-line", display: "inline-block" }} 
                        repeat={Infinity} 
                    />
                </h1>
                <div className={styles.buttonGroup}>
                    {/* ... (기존 버튼 UI와 동일) ... */}
                </div>
                <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleImageSelect} />
                <div className={styles.previewGrid}>
                    {/* ... (기존 이미지 프리뷰 UI와 동일) ... */}
                </div>
            </div>
            <div className={styles.navButtonContainer}>
                <button onClick={() => router.push("/style-select")} className={styles.navButton}>뒤로가기</button>
                <button onClick={handleNext} className={`${styles.navButton} ${styles.primary}`} disabled={selectedImageCount === 0}>다음으로</button>
            </div>
        </div>
    );
}