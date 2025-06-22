// ppongtok-app/pages/musicselectpage.jsx (에러 수정 완료)

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../src/styles/musicselectpage.module.css";

// 예시 테마 음악 데이터
const themeMusicData = [
  { id: 'music1', title: '설레는 마음', src: '/music/spring.mp3' },
  { id: 'music2', title: '잔잔한 파도처럼', src: '/music/night-sea.mp3' },
  { id: 'music3', title: '우리의 행복한 날', src: '/music/happy.mp3' },
  { id: 'music4', title: '아련한 기억 속에서', src: '/music/memory.mp3' },
];

export default function MusicSelectPage() {
  const router = useRouter();
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [playingMusicId, setPlayingMusicId] = useState(null);
  const [myMusic, setMyMusic] = useState(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // 페이지 로드 시 로컬 스토리지에서 선택된 테마 음악 확인
  useEffect(() => {
    // 브라우저 환경에서만 localStorage에 접근하도록 확인
    if (typeof window !== 'undefined') {
      const themeSrc = localStorage.getItem("selected-music");
      const themeLabel = localStorage.getItem("selected-music-label");

      if (themeSrc && themeLabel) {
        const newMusic = { id: 'theme_music', title: themeLabel, src: themeSrc };
        setSelectedMusic(newMusic);
        localStorage.removeItem("selected-music");
        localStorage.removeItem("selected-music-label");
      }
    }
    
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
    setPlayingMusicId(null); // 음악 선택 시 재생 중지
    if(audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleMyFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSrc = URL.createObjectURL(file);
      const newMusic = { id: 'my_music', title: file.name, src: fileSrc };
      setMyMusic(newMusic);
      handleSelect(newMusic);
    }
  };

  const goToNextStep = () => {
    if (selectedMusic) {
      localStorage.setItem('selected_music_src', selectedMusic.src);
      localStorage.setItem('selected_music_title', selectedMusic.title);
    }
    const presentationId = `pres_${new Date().getTime()}`;
    router.push(`/view/${presentationId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <audio ref={audioRef} onEnded={() => setPlayingMusicId(null)} />
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
        
        <div className={styles.musicList}>
          {myMusic && (
            <MusicItem 
              music={myMusic}
              isSelected={selectedMusic?.id === myMusic.id}
              isPlaying={playingMusicId === myMusic.id}
              onPreview={handlePreview}
              onSelect={handleSelect}
            />
          )}
          {themeMusicData.map((music) => (
            <MusicItem 
              key={music.id}
              music={music}
              isSelected={selectedMusic?.id === music.id}
              isPlaying={playingMusicId === music.id}
              onPreview={handlePreview}
              onSelect={handleSelect}
            />
          ))}
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
          onClick={() => {
            localStorage.removeItem('selected_music_src');
            localStorage.removeItem('selected_music_title');
            
            const presentationId = `pres_${new Date().getTime()}`;
            router.push(`/view/${presentationId}`);
          }} 
          className={styles.navButton}
        >
          건너뛰기
        </button>
        
        <button 
          onClick={goToNextStep} 
          className={`${styles.navButton} ${styles.primary}`}
          disabled={!selectedMusic}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}

// ▼▼▼▼▼ [에러 해결] 이 컴포넌트가 누락되어 있었습니다. ▼▼▼▼▼
// 개별 음악 아이템을 위한 재사용 컴포넌트
function MusicItem({ music, isSelected, isPlaying, onPreview, onSelect }) {
  return (
    <div className={`${styles.musicItem} ${isSelected ? styles.selected : ''}`}>
      <span 
        className={styles.playIcon} 
        onClick={() => onPreview(music)}
      >
        {isPlaying ? '❚❚' : '▶'}
      </span>
      <p className={styles.musicTitle}>{music.title}</p>
      <button 
        className={styles.selectButton}
        onClick={() => onSelect(music)}
      >
        {isSelected ? '✔ 선택됨' : '선택'}
      </button>
    </div>
  );
}
// ▲▲▲▲▲ [에러 해결] ▲▲▲▲▲