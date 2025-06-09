import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter
import styles from "./musicselectpage.module.css"; // ✅ CSS 모듈로 변경

const MusicSelectPage = () => {
  const router = useRouter(); // ✅ useNavigate → useRouter
  const fileInputRef = useRef(null);

  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musicName, setMusicName] = useState("");

  useEffect(() => {
    const allowed = localStorage.getItem("allow-music");
    if (allowed !== "true") {
      console.warn("🚫 비인가 접근. 스타일 선택으로 되돌림.");
      router.replace("/style/select"); // ✅ navigate → router.replace
    }
  }, [router]);

  useEffect(() => {
    const storedMusic = localStorage.getItem("selected-music");
    const storedLabel = localStorage.getItem("selected-music-label");

    if (storedMusic) {
      console.log("📁 localStorage → selectedMusic:", storedMusic);
      setSelectedMusic(storedMusic);
    } else {
      console.warn("⚠️ storedMusic is null or undefined");
    }

    if (storedLabel) {
      console.log("📁 localStorage → musicName:", storedLabel);
      setMusicName(storedLabel);
    }
  }, []);

  const handleDelete = () => {
    setSelectedMusic(null);
    setMusicName("");
    localStorage.removeItem("selected-music");
    localStorage.removeItem("selected-music-label");
  };

  const handleMusicFile = () => router.push("/music/theme");

  const handleLocalFile = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const musicUrl = URL.createObjectURL(file);
    setSelectedMusic(musicUrl);
    setMusicName(file.name);
    localStorage.setItem("selected-music", musicUrl);
    localStorage.setItem("selected-music-label", file.name);
  };

  const handleBack = () => {
    const mediaType = localStorage.getItem("media-type"); // 예: "image" 또는 "video"
    if (mediaType === "video") {
      router.push("/videoselectpage");
    } else {
      router.push("/imageselectpage");
    }
  };

  const handleNext = () => {
    const selectedType = localStorage.getItem("selected-type");
    if (selectedType === "video") {
      router.push("/preview?type=video");
    } else {
      router.push("/preview?type=image");
    }
  };

  return (
    <div className={styles["music-select-page"]}>
      <div className={styles["typing-text"]}>
        <div className={styles["line1"]}>배경으로 사용할 음악을</div>
        <div className={styles["line2"]}>선택해주세요</div>
      </div>

      <div className={styles["file-button-group"]}>
        <button onClick={handleMusicFile}>배경음악 파일</button>
        <button onClick={handleLocalFile}>내 파일 선택</button>
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {selectedMusic && (
        <>
          {console.log("🎧 조건부 렌더링 selectedMusic:", selectedMusic)}
          <div className={styles["music-box"]}>
            <span className={styles["music-label"]}>{musicName}</span>
            <div className={styles["audio-wrapper"]}>
              <audio controls autoPlay src={selectedMusic} />
            </div>
            <button className={styles["delete-button"]} onClick={handleDelete}>
              ❌
            </button>
          </div>
        </>
      )}

      <div className={styles["button-group"]}>
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>미리보기로 이동</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
