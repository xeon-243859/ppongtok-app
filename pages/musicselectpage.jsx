// ppongtok-app/pages/musicselectpage.jsx (모바일 최적화 및 UI/UX 개선 완료)

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicselectpage.module.css";

export default function MusicSelectPage() {
  const router = useRouter();
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // 페이지 로드 시 또는 selectedMusic 변경 시 오디오 소스 설정
  useEffect(() => {
    if (selectedMusic && audioRef.current) {
      if (audioRef.current.src !== selectedMusic.src) {
        audioRef.current.src = selectedMusic.src;
      }
    }
  }, [selectedMusic]);
  
  // 테마 페이지에서 선택한 음악을 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const themeSrc = localStorage.getItem("selected-music");
      const themeLabel = localStorage.getItem("selected-music-label");

      if (themeSrc && themeLabel) {
        setSelectedMusic({ title: themeLabel, src: themeSrc });
        localStorage.removeItem("selected-music");
        localStorage.removeItem("selected-music-label");
      }
    }
  }, []);

  const handlePreview = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("오디오 재생 오류:", e));
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleRemoveSelection = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setSelectedMusic(null);
    setIsPlaying(false);
  };

  const handleMyFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSrc = URL.createObjectURL(file);
      setSelectedMusic({ title: file.name, src: fileSrc });
      setIsPlaying(false);
    }
  };

  const goToNextStep = (skip = false) => {
    if (skip || !selectedMusic) {
      localStorage.removeItem('selected_music_src');
      localStorage.removeItem('selected_music_title');
    } else {
      localStorage.setItem('selected_music_src', selectedMusic.src);
      localStorage.setItem('selected_music_title', selectedMusic.title);
    }
    const presentationId = `pres_${new Date().getTime()}`;
    router.push(`/view/${presentationId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <input 
        type="file" 
        accept="audio/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          배경으로 사용할 음악을<br />선택해 주세요
        </h1>

        <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => router.push('/musicthemepage')}>
                배경음악파일
            </button>
            <button className={styles.button} onClick={handleMyFileClick}>
                내 파일 선택
            </button>
        </div>
        
        <div className={styles.selectionArea}>
          {selectedMusic ? (
            <div className={styles.player}>
              <div className={styles.musicInfo}>
                <span className={styles.musicIcon}>🎵</span>
                <p className={styles.musicTitle} title={selectedMusic.title}>
                  {selectedMusic.title}
                </p>
              </div>
              <div className={styles.playerControls}>
                <button onClick={handlePreview} className={styles.controlButton}>
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                <button onClick={handleRemoveSelection} className={styles.controlButton}>
                  ×
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>배경음악파일을 선택하거나<br/>내 파일을 업로드해 주세요.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.navButtonContainer}>
        <button 
          onClick={() => router.push('/imageselectpage')} 
          className={styles.navButton}
        >
          뒤로가기
        </button>
        <button 
          onClick={() => goToNextStep(true)} 
          className={styles.navButton}
        >
          건너뛰기
        </button>
        <button 
          onClick={() => goToNextStep(false)} 
          className={`${styles.navButton} ${styles.primary}`}
          disabled={!selectedMusic}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}