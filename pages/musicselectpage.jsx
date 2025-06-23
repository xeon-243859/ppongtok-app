// ppongtok-app/pages/musicselectpage.jsx (경로 설정 수정 완료)

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
  
  // (다른 함수들은 이전과 동일하게 유지)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const themeSrc = localStorage.getItem("selected-music-theme");
      const themeLabel = localStorage.getItem("selected-music-theme-label");
      if (themeSrc && themeLabel) {
        setSelectedMusic({ title: themeLabel, src: themeSrc });
        localStorage.removeItem("selected-music-theme");
        localStorage.removeItem("selected-music-theme-label");
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
  
  const handlePlayPause = () => { if (!audioRef.current || !selectedMusic) return; if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play().catch(e => console.error("재생 오류:", e)); } };
  const handleRemoveSelection = () => { setSelectedMusic(null); };
  const handleMyFileClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (event) => { const file = event.target.files[0]; if (file) { const fileSrc = URL.createObjectURL(file); setSelectedMusic({ title: file.name, src: fileSrc }); } };
  const handleTimeUpdate = () => { if (audioRef.current) { const { currentTime, duration } = audioRef.current; if (duration) { setProgress((currentTime / duration) * 100); } } };

  // [수정] goToNextStep 함수
  const goToNextStep = (skip = false) => {
    if (skip || !selectedMusic) {
      localStorage.removeItem('selected_music_src');
      localStorage.removeItem('selected_music_title');
    } else {
      localStorage.setItem('selected_music_src', selectedMusic.src);
      localStorage.setItem('selected_music_title', selectedMusic.title);
    }
    
    // [중요] ID를 'preview'라는 고정값으로 넘깁니다.
    router.push('/view/preview');
  };

  return (
    <div className={styles.pageContainer}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => { setIsPlaying(false); setProgress(0); }} />
      <input type="file" accept="audio/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>배경으로 사용할 음악을<br />선택해 주세요</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={() => router.push('/musicthemepage')}>배경음악파일</button>
          <button className={styles.button} onClick={handleMyFileClick}>내 파일 선택</button>
        </div>
        <div className={styles.playerCard}>
          <div className={styles.albumArt}>{selectedMusic ? '🎵' : '❔'}</div>
          <div className={styles.musicDetails}>
            <p className={styles.musicTitle}>{selectedMusic ? selectedMusic.title : '음악을 선택하세요'}</p>
            <p className={styles.musicArtist}>{selectedMusic ? '선택된 음악' : '파일 선택 또는 테마 선택'}</p>
          </div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
          <div className={styles.playerControls}>
            <button onClick={handlePlayPause} className={`${styles.controlButton} ${styles.playButton}`} disabled={!selectedMusic}>{isPlaying ? '❚❚' : '▶'}</button>
            <button onClick={handleRemoveSelection} className={`${styles.controlButton} ${styles.removeButton}`} disabled={!selectedMusic}>×</button>
          </div>
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