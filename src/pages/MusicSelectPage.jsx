import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicSelectPage.css';

const audios = [
  '/audio/mueon.mp3',
  '/audio/mueon1.mp3',
  '/audio/spring.mp3',
  '/audio/spring1.mp3'
];

export default function MusicSelectPage({ setSelectedMusic }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const audioRef = useRef(null);

  const handleSelect = (music) => {
    setSelected(music);
    setSelectedMusic(music);
  };

  useEffect(() => {
    if (audioRef.current && selected) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [selected]);

  return (
    <div className="music-container">
      <h2>배경 음악을 선택해 주세요</h2>
      <div className="music-options">
        {audios.map((src, idx) => (
          <button
            key={idx}
            className={selected === src ? 'selected' : ''}
            onClick={() => handleSelect(src)}
          >
            음악 {idx + 1}
          </button>
        ))}
      </div>
      {selected && (
        <audio ref={audioRef} controls>
          <source src={selected} type="audio/mp3" />
          브라우저가 오디오 태그를 지원하지 않습니다.
        </audio>
      )}
      <div className="navigation-buttons">
        <button onClick={() => navigate('/love/video')}>뒤로가기</button>
        <button onClick={() => navigate('/love/generate')} disabled={!selected}>다음으로</button>
      </div>
    </div>
  );
}