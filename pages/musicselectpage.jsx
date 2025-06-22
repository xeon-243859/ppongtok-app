// ppongtok-app/pages/musicselectpage.jsx

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicselectpage.module.css";
// =======================================================================
// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 문제의 원인이었던 아래 줄을 삭제합니다! ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// import { FaPlay, FaPause, FaCheck } from 'react-icons/fa'; 
// =======================================================================


// 예시 테마 음악 데이터
const themeMusic = [
  { id: 'music1', title: '설레는 마음', src: '/music/spring.mp3' },
  { id: 'music2', title: '잔잔한 파도처럼', src: '/music/night-sea.mp3' },
  { id: 'music3', title: '우리의 행복한 날', src: '/music/happy.mp3' },
  { id: 'music4', title: '아련한 기억 속에서', src: '/music/memory.mp3' },
];

export default function MusicSelectPage() {
  const router = useRouter();
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [playingMusicId, setPlayingMusicId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePreview = (music) => {
    if (playingMusicId === music.id) {
      audioRef.current.pause();
      setPlayingMusicId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = music.src;
        audioRef.current.play().catch(e => console.error("오디오 재생 오류:", e));
        setPlayingMusicId(music.id);
      }
    }
  };
  
  const handleSelect = (music) => {
    setSelectedMusic(music);
    if (playingMusicId === music.id) {
      audioRef.current.pause();
      setPlayingMusicId(null);
    }
  };

  const goToNextStep = () => {
    if (selectedMusic) {
      localStorage.setItem('selected_music_src', selectedMusic.src);
      localStorage.setItem('selected_music_title', selectedMusic.title);
    } else {
      localStorage.removeItem('selected_music_src');
      localStorage.removeItem('selected_music_title');
    }
    const presentationId = `pres_${new Date().getTime()}`;
    router.push(`/view/${presentationId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <audio ref={audioRef} onEnded={() => setPlayingMusicId(null)} />
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>배경음악을 선택해주세요</h1>
        <p className={styles.subtitle}>음악을 추가하면 감동이 배가 됩니다.</p>

        <div className={styles.musicList}>
          {themeMusic.map((music) => (
            <div key={music.id} className={`${styles.musicItem} ${selectedMusic?.id === music.id ? styles.selected : ''}`}>
              <div className={styles.musicInfo}>
                <p className={styles.musicTitle}>{music.title}</p>
              </div>
              <div className={styles.musicControls}>
                <button onClick={() => handlePreview(music)} className={styles.controlButton}>
                  {/* [수정] 아이콘 대신 텍스트 문자로 대체 */}
                  {playingMusicId === music.id ? '❚❚' : '▶'}
                </button>
                <button onClick={() => handleSelect(music)} className={styles.controlButton}>
                  {/* [수정] 아이콘 대신 텍스트 문자로 대체 */}
                  ✔
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.uploadSection}>
            <button className={styles.button} onClick={() => router.push('/musicthemepage')}>
                테마 음악 더보기
            </button>
        </div>
      </div>

      <div className={styles.navButtonContainer}>
        <button onClick={() => router.push('/imageselectpage')} className={`${styles.button} ${styles.navButton}`}>
          뒤로가기
        </button>
        <button onClick={goToNextStep} className={`${styles.button} ${styles.navButton}`}>
          건너뛰기
        </button>
        <button onClick={goToNextStep} className={`${styles.button} ${styles.navButton} ${styles.buttonPrimary}`}>
          {selectedMusic ? "선택 완료" : "음악 없이 만들기"}
        </button>
      </div>
    </div>
  );
}