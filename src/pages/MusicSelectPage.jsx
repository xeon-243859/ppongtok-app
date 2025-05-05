import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicSelectPage.css';

const defaultAudios = [
  '/audio/mueon.mp3',
  '/audio/mueon1.mp3',
  '/audio/spring.mp3',
  '/audio/spring1.mp3',
];

function MusicSelectPage() {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const navigate = useNavigate();

  const handleSelectAudio = (src) => {
    setSelectedAudio(src);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setSelectedAudio(audioUrl);
    }
  };

  const handleNext = () => {
    if (selectedAudio) {
      localStorage.setItem('selectedAudio', selectedAudio);
      navigate('/love/generate');
    } else {
      alert('배경 음악을 선택해주세요.');
    }
  };

  const handleBack = () => {
    navigate('/love/video');
  };

  return (
    <div className="music-page-container">
      <h2>배경음악선택하기</h2>

      <div className="style-buttons">
        <button onClick={() => handleSelectAudio(defaultAudios[0])}>팝스타일</button>
        <button onClick={() => handleSelectAudio(defaultAudios[1])}>클래식</button>
        <button onClick={() => handleSelectAudio(defaultAudios[2])}>상송</button>
        <button onClick={() => handleSelectAudio(defaultAudios[3])}>코리아쏭</button>
      </div>

      <label className="upload-box">
        내 파일 선택
        <input type="file" accept="audio/*" onChange={handleFileChange} hidden />
      </label>

      <div className="audio-preview-box">
        {selectedAudio && (
          <audio controls src={selectedAudio} />
        )}
      </div>

      <div className="button-group">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
}

export default MusicSelectPage;
