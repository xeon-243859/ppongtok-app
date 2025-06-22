// ppongtok-app/pages/videoselectpage.jsx (로직 및 UI 문제 수정 완료)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/videoselectpage.module.css";

export default function VideoSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // [수정] 페이지가 다시 포커스될 때마다 localStorage를 확인하는 로직
  useEffect(() => {
    const checkLocalStorage = () => {
      const storedVideo = localStorage.getItem("selected-video-theme");
      if (storedVideo) {
        setSelectedVideo(storedVideo);
        localStorage.removeItem("selected-video-theme");
      }
    };
    
    // 페이지 첫 로드 시 확인
    checkLocalStorage(); 

    // 다른 페이지 갔다가 돌아왔을 때(focus) 다시 확인
    window.addEventListener('focus', checkLocalStorage);

    // 컴포넌트가 사라질 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('focus', checkLocalStorage);
    };
  }, []); // 이 useEffect는 마운트/언마운트 시 한 번만 실행되어 이벤트 리스너를 설정/제거합니다.


  const handleMyFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("비디오 파일 크기는 10MB를 초과할 수 없습니다.");
        return;
      }
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
    }
  };

  const handleNext = () => {
    if (!selectedVideo) {
      alert("배경으로 사용할 영상을 선택해주세요!");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-video", selectedVideo);
      localStorage.setItem("selected-type", "video");
      localStorage.removeItem("ppong_image_0");
      localStorage.removeItem("ppong_image_1");
      localStorage.removeItem("ppong_image_2");
      localStorage.removeItem("ppong_image_3");
      router.push("/musicselectpage");
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 
        [수정] contentWrapper가 모든 내용을 감싸도록 변경하여 
        버튼 위치 문제를 해결합니다. 
      */}
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
            <TypeAnimation 
                sequence={[
                    "배경으로 사용할\n영상을 선택해 주세요", 2000, 
                    "10MB 이하의 영상만\n업로드 가능합니다", 4000
                ]} 
                wrapper="span" 
                speed={50} 
                cursor={true} 
                style={{ whiteSpace: "pre-line", display: "inline-block" }} 
                repeat={Infinity} 
            />
        </h1>
        
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={() => router.push('/videothemepage')}>
            테마 영상 선택
          </button>
          <button className={styles.button} onClick={handleMyFileClick}>
            내 파일 선택
          </button>
        </div>

        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className={styles.videoPreviewArea}>
          {selectedVideo ? (
            <video
              key={selectedVideo}
              src={selectedVideo}
              autoPlay
              loop
              muted
              playsInline
              className={styles.videoPlayer}
            />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>🎬</span>
              <p>테마 또는 내 파일을 선택하세요</p>
            </div>
          )}
        </div>

        <div className={styles.navButtonContainer}>
          <button onClick={() => router.push('/style-select')} className={styles.navButton}>
            뒤로가기
          </button>
          <button onClick={handleNext} className={`${styles.navButton} ${styles.primary}`} disabled={!selectedVideo}>
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
}