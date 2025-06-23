// ppongtok-app/pages/musicselectpage.jsx (선택 목록 UI 복구 및 전체 기능 수정 완료)

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicselectpage.module.css";



export default function MusicSelectPage() {
  const router = useRouter();
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // 로직을 이전의 가장 안정적인 버전으로 되돌립니다.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const themeSrc = localStorage.getItem("selected-music");
      const themeLabel = localStorage.getItem("selected-music-label");
      if (themeSrc && themeLabel) {
        setSelectedMusic({ id: 'theme_music', title: themeLabel, src: themeSrc });
        localStorage.removeItem("selected-music");
        localStorage.removeItem("selected-music-label");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedMusic && audioRef.current) {
      audioRef.current.src = selectedMusic.src;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true))
                 .catch(error => { console.error("자동 재생 실패:", error); setIsPlaying(false); });
      }
    } else if (!selectedMusic && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      setProgress(0);
    }
  }, [selectedMusic]);
  
  const handlePlayPause = () => {
    if (!audioRef.current || !selectedMusic) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("재생 오류:", e));
    }
  };
  
  // [수정] 음악을 선택하는 핵심 함수
  const handleSelect = (music) => {
    setSelectedMusic(music);
  };
  
  const handleMyFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (event) => { const file = event.target.files[0]; if (file) { const fileSrc = URL.createObjectURL(file); handleSelect({ id: 'my_music', title: file.name, src: fileSrc }); } };
  const handleTimeUpdate = () => { if (audioRef.current) { const { currentTime, duration } = audioRef.current; if (duration) { setProgress((currentTime / duration) * 100); } } };

  const goToNextStep = (skip = false) => {
    if (skip || !selectedMusic) {
      localStorage.removeItem('selected_music_src');
      localStorage.removeItem('selected_music_title');
    } else {
      localStorage.setItem('selected_music_src', selectedMusic.src);
      localStorage.setItem('selected_music_title', selectedMusic.title);
    }
    router.push('/view/preview');
  };

  return (
    <div className={styles.pageContainer}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => { setIsPlaying(false); setProgress(0); }} />
      <input type="file" accept="audio/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>배경으로 사용할 음악을<br />선택해 주세요</h1>
        
        {/* 예쁜 플레이어 UI는 그대로 유지 */}
        <div className={styles.playerCard}>
          <div className={styles.albumArt}>{selectedMusic ? '🎵' : '❔'}</div>
          <div className={styles.musicDetails}>
            <p className={styles.musicTitle} title={selectedMusic?.title}>{selectedMusic ? selectedMusic.title : '음악을 선택하세요'}</p>
            <p className={styles.musicArtist}>{selectedMusic ? '선택된 음악' : '아래 목록 또는 파일에서 선택'}</p>
          </div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
          <div className={styles.playerControls}>
            <button onClick={handlePlayPause} className={`${styles.controlButton} ${styles.playButton}`} disabled={!selectedMusic}>{isPlaying ? '❚❚' : '▶'}</button>
          </div>
        </div>

        {/* [복구] 음악 선택 목록 UI */}
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={() => router.push('/musicthemepage')}>배경음악파일</button>
          <button className={styles.button} onClick={handleMyFileClick}>내 파일 선택</button>
        </div>

       

        <div className={styles.navButtonContainer}>
          <button onClick={() => router.push('/imageselectpage')} className={styles.navButton}>뒤로가기</button>
          <button onClick={() => goToNextStep(true)} className={styles.navButton}>건너뛰기</button>
          <button onClick={() => goToNextStep(false)} className={`${styles.navButton} ${styles.primary}`} disabled={!selectedMusic}>다음으로</button>
        </div>
      </div>
    </div>
  );
}