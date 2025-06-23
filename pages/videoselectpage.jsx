// ppongtok-app/pages/videoselectpage.jsx (단순화된 최종 로직)

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TypeAnimation } from "react-type-animation";
import styles from "../src/styles/videoselectpage.module.css";

export default function VideoSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // [수정] 가장 단순하고 확실한 로직으로 변경
  useEffect(() => {
    // sessionStorage는 현재 탭에서만 유지되는 임시 저장소
    const isReturning = sessionStorage.getItem('returning_from_theme');
    const storedVideo = localStorage.getItem("selected-video-theme");

    console.log(`[SelectPage] 페이지 로드/업데이트. isReturning: ${isReturning}, storedVideo: ${storedVideo}`);

    if (storedVideo) {
      console.log(`[SelectPage] ✅ localStorage에서 '${storedVideo}' 값을 찾았습니다. 상태 업데이트!`);
      setSelectedVideo(storedVideo);
      localStorage.removeItem("selected-video-theme");
      // 사용한 후에는 세션 스토리지의 흔적도 지움
      if (isReturning) {
        sessionStorage.removeItem('returning_from_theme');
      }
    }
  }, [router.asPath]); // URL 경로가 바뀔 때마다 이 useEffect를 다시 실행 (가장 표준적인 방법)


  const handleThemeClick = () => {
    // 테마 페이지로 떠나기 전에, '돌아올 것이다'라는 흔적을 남김
    console.log("[SelectPage] 테마 페이지로 이동. 'returning_from_theme' 흔적을 남깁니다.");
    sessionStorage.setItem('returning_from_theme', 'true');
    router.push('/videothemepage');
  };
  
  // (다른 함수들은 그대로 유지)
  const handleMyFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { alert("비디오 파일 크기는 10MB를 초과할 수 없습니다."); return; }
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
    }
  };
  const handleNext = () => {
    if (!selectedVideo) { alert("배경으로 사용할 영상을 선택해주세요!"); return; }
    localStorage.setItem("selected-video", selectedVideo);
    localStorage.setItem("selected-type", "video");
    localStorage.removeItem("ppong_image_0"); localStorage.removeItem("ppong_image_1");
    localStorage.removeItem("ppong_image_2"); localStorage.removeItem("ppong_image_3");
    router.push("/musicselectpage");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
            <TypeAnimation 
                sequence={["배경으로 사용할\n영상을 선택해 주세요", 2000, "10MB 이하의 영상만\n업로드 가능합니다", 4000]} 
                wrapper="span" speed={50} cursor={true} 
                style={{ whiteSpace: "pre-line", display: "inline-block" }} repeat={Infinity} 
            />
        </h1>
        
        <div className={styles.buttonGroup}>
          {/* [수정] onClick에 새로 만든 handleThemeClick 함수 연결 */}
          <button className={styles.button} onClick={handleThemeClick}>
            테마 영상 선택
          </button>
          <button className={styles.button} onClick={handleMyFileClick}>
            내 파일 선택
          </button>
        </div>

        <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

        <div className={styles.videoPreviewArea}>
          {selectedVideo ? (
            <video key={selectedVideo} src={selectedVideo} autoPlay loop muted playsInline className={styles.videoPlayer} />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>🎬</span>
              <p>테마 또는 내 파일을 선택하세요</p>
            </div>
          )}
        </div>

        <div className={styles.navButtonContainer}>
          <button onClick={() => router.push('/style-select')} className={styles.navButton}>뒤로가기</button>
          <button onClick={handleNext} className={`${styles.navButton} ${styles.primary}`} disabled={!selectedVideo}>다음으로</button>
        </div>
      </div>
    </div>
  );
}