// ppongtok-app/pages/musicselectpage.jsx (안정성 강화 버전)

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicselectpage.module.css";

// ❗️ 중요: MusicSelectPage 바깥에 빈 컴포넌트를 하나 정의합니다.
// 이는 초기 렌더링 시 발생하는 문제를 회피하기 위한 안전장치입니다.
const SafeHydration = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return isMounted ? <>{children}</> : null;
};

export default function MusicSelectPage() {
  const router = useRouter();
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // ✨ 수정 1: router.isReady를 사용하여 페이지가 완전히 준비되었을 때만 localStorage 접근
  useEffect(() => {
    // router가 준비되지 않았거나, 서버 사이드 렌더링 중일 때는 아무것도 하지 않음
    if (!router.isReady || typeof window === "undefined") {
      return;
    }

    const themeSrc = localStorage.getItem("selected-music");
    const themeLabel = localStorage.getItem("selected-music-label");

    if (themeSrc && themeLabel) {
      setSelectedMusic({ id: 'theme_music', title: themeLabel, src: themeSrc });
      // 사용 후 즉시 제거하여 중복 실행 방지
      localStorage.removeItem("selected-music");
      localStorage.removeItem("selected-music-label");
    }
  }, [router.isReady]); // router.isReady가 true가 되면 이 useEffect가 다시 실행됨

  // 선택된 음악이 변경될 때의 로직 (기존과 동일, 안정적)
  useEffect(() => {
    if (selectedMusic && audioRef.current) {
      audioRef.current.src = selectedMusic.src;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error("자동 재생 실패:", error);
            setIsPlaying(false);
          });
      }
    } else if (!selectedMusic && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      setProgress(0);
    }
  }, [selectedMusic]);
  
  // 나머지 핸들러 함수들은 기존과 동일
  const handlePlayPause = () => { /* ... */ };
  const handleSelect = (music) => { setSelectedMusic(music); };
  const handleMyFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (event) => { /* ... */ };
  const handleTimeUpdate = () => { /* ... */ };

  const goToNextStep = (skip = false) => {
    if (skip || !selectedMusic) {
      localStorage.removeItem('selected_music_src');
      localStorage.removeItem('selected_music_title');
    } else {
      localStorage.setItem('selected_music_src', selectedMusic.src);
      localStorage.setItem('selected_music_title', selectedMusic.title);
    }
    // ✨ 수정 2: router.push 경로 수정
    // 미리보기 페이지의 경로가 `/view/[id]` 이고 `id`가 `preview`이므로 경로를 정확히 지정합니다.
    router.push('/view/preview'); 
  };

  // ✨ 수정 3: SafeHydration 컴포넌트로 전체 UI를 감싸줍니다.
  // 이렇게 하면 클라이언트 사이드에서 컴포넌트가 완전히 마운트된 후에 UI가 렌더링되어
  // 서버-클라이언트 간의 불일치로 인한 오류(Hydration Error)를 방지할 수 있습니다.
  return (
    <SafeHydration>
      <div className={styles.pageContainer}>
        <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => { setIsPlaying(false); setProgress(0); }} />
        <input type="file" accept="audio/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>배경으로 사용할 음악을<br />선택해 주세요</h1>
          
          <div className={styles.playerCard}>
            {/* ... 기존 플레이어 UI ... */}
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => router.push('/musicthemepage')}>테마 음악 선택</button>
            <button className={styles.button} onClick={handleMyFileClick}>내 파일 선택</button>
          </div>
          
          <div className={styles.navButtonContainer}>
            <button onClick={() => router.back()} className={styles.navButton}>뒤로가기</button>
            <button onClick={() => goToNextStep(true)} className={styles.navButton}>건너뛰기</button>
            <button onClick={() => goToNextStep(false)} className={`${styles.navButton} ${styles.primary}`} disabled={!selectedMusic}>다음으로</button>
          </div>
        </div>
      </div>
    </SafeHydration>
  );
}