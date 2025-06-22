// ppongtok-app/pages/videoselectpage.jsx (라우터 이벤트 감지 로직으로 수정 완료)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/videoselectpage.module.css";

export default function VideoSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // [수정] Next.js 라우터 이벤트를 감지하여 localStorage를 확인하는 가장 확실한 방법
  useEffect(() => {
    const checkLocalStorage = () => {
      // console.log("경로 변경 완료, localStorage 확인 시작!");
      const storedVideo = localStorage.getItem("selected-video-theme");
      if (storedVideo) {
        // console.log("테마 비디오 발견:", storedVideo);
        setSelectedVideo(storedVideo);
        localStorage.removeItem("selected-video-theme");
      }
    };

    // 페이지에 처음 진입했을 때 한 번 실행
    checkLocalStorage();

    // 다른 경로로 이동했다가 이 페이지로 돌아오는 '경로 변경 완료' 이벤트를 감지
    router.events.on('routeChangeComplete', checkLocalStorage);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 반드시 정리해줘야 메모리 누수를 막을 수 있음
    return () => {
      router.events.off('routeChangeComplete', checkLocalStorage);
    };
  }, [router.events]); // router.events가 변경될 일은 없지만, 의존성을 명시적으로 표시


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