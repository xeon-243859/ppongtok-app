// ppongtok-app/pages/musicselectpage.jsx (모바일 UI/UX 전면 개편)

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicselectpage.module.css";

export default function MusicSelectPage() {
  const router = useRouter();
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 프로그레스 바 상태
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // 테마 페이지에서 선택한 음악을 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const themeSrc = localStorage.getItem("selected-music");
      const themeLabel = localStorage.getItem("selected-music-label");

      if (themeSrc && themeLabel) {
        setSelectedMusic({ title: themeLabel, src: themeSrc });
        localStorage.removeItem("selected-music");
        localStorage.removeItem("selected-music-label");
      }
    }
  }, []);

  // 음악 소스가 변경되면 오디오 태그에 반영
  useEffect(() => {
    if (selectedMusic && audioRef.current) {
      if (audioRef.current.src !== selectedMusic.src) {
        audioRef.current.src = selectedMusic.src;
        setProgress(0); // 새 음악이므로 프로그레스 리셋
      }
    }
  }, [selectedMusic]);


  const handlePlayPause = () => {
    if (!audioRef.current || !selectedMusic) return;

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
    setProgress(0);
  };

  const handleMyFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSrc = URL.createObjectURL(file);
      setSelectedMusic({ title: file.name, src: fileSrc });
      setIsPlaying(false); // 새 파일 선택 시 재생은 멈춤
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
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
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)} 
      />
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
        
        {/* --- 새로운 음악 플레이어 UI --- */}
        <div className={styles.playerCard}>
            <div className={styles.albumArt}>
                {selectedMusic ? '🎵' : '❔'}
            </div>
            <div className={styles.musicDetails}>
                <p className={styles.musicTitle}>
                    {selectedMusic ? selectedMusic.title : '음악을 선택하세요'}
                </p>
                <p className={styles.musicArtist}>
                    {selectedMusic ? '선택된 음악' : '파일 선택 또는 테마 선택'}
                </p>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.playerControls}>
                <button 
                    onClick={handlePlayPause} 
                    className={`${styles.controlButton} ${styles.playButton}`}
                    disabled={!selectedMusic}
                >
                    {isPlaying ? '❚❚' : '▶'}
                </button>
                <button 
                    onClick={handleRemoveSelection} 
                    className={`${styles.controlButton} ${styles.removeButton}`}
                    disabled={!selectedMusic}
                >
                    ×
                </button>
            </div>
        </div>

        {/* --- 하단 네비게이션 버튼 (위치 이동) --- */}
        <div className={styles.navButtonContainer}>
          <button onClick={() => router.push('/imageselectpage')} className={styles.navButton}>
            뒤로가기
          </button>
          <button onClick={() => goToNextStep(true)} className={styles.navButton}>
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
    </div>
  );
}