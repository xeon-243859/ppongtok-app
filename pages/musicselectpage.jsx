import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./musicselectpage.module.css";
import appStyles from "../src/styles/AppTheme.module.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../src/firebase";

export default function MusicSelectPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musicName, setMusicName] = useState("");

  useEffect(() => {
    // 페이지 접근 권한 체크 로직은 그대로 유지
    const allowed = localStorage.getItem("allow-music");
    if (allowed !== "true") {
      alert("이전 단계를 먼저 완료해주세요.");
      router.replace("/style-select");
    }

    const storedMusic = localStorage.getItem("selected-music");
    const storedLabel = localStorage.getItem("selected-music-label");

    if (storedMusic) setSelectedMusic(storedMusic);
    if (storedLabel) setMusicName(storedLabel);
  }, [router]);

  const handleMusicTheme = () => router.push("/musicthemepage");

  const handleLocalFile = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 20MB 용량 제한
    const MAX_SIZE_MB = 20;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`음악 파일의 크기가 너무 큽니다. (${MAX_SIZE_MB}MB 이하만 가능합니다)`);
      e.target.value = null;
      return;
    }

    const musicUrl = URL.createObjectURL(file);
    setSelectedMusic(musicUrl);
    setMusicName(file.name);
    localStorage.setItem("selected-music", musicUrl);
    localStorage.setItem("selected-music-label", file.name);
  };

  const handleNext = async () => {
    // 선택된 음악을 localStorage에 저장 (건너뛰기 시에는 빈 값)
    localStorage.setItem("selected-music", selectedMusic || "");
    
    // 이제 미리보기 페이지로 이동합니다.
    const messageId = localStorage.getItem("message-id");
    if (!messageId) {
      alert("메시지 ID가 없습니다. 처음부터 다시 시도해주세요.");
      router.push("/");
      return;
    }
    router.push(`/view/${messageId}`);
  };

  const handleBack = () => {
    const mediaType = localStorage.getItem("selected-type");
    router.push(mediaType === "video" ? "/videoselectpage" : "/imageselectpage");
  };

  return (
    <div className={`${appStyles.pageContainer} ${styles.pageLayout}`}>
      <h2 className={appStyles.pageTitle}>배경으로 사용할 음악을</h2>
      <h2 className={appStyles.pageTitle} style={{ marginTop: '-10px' }}>선택해주세요</h2>

      <div className={appStyles.buttonGroup}>
        <button onClick={handleMusicTheme} className={appStyles.buttonPrimary}>테마 음악 선택</button>
        <button onClick={handleLocalFile} className={appStyles.buttonPrimary}>내 파일 선택</button>
      </div>

      <div className={styles["music-box"]}>
        {selectedMusic ? (
          <>
            <span className={styles["music-label"]}>{musicName}</span>
            <div className={styles["audio-wrapper"]}>
              <audio controls autoPlay src={selectedMusic} />
            </div>
          </>
        ) : (
          <p className={styles.placeholder}>선택된 음악이 없습니다.</p>
        )}
      </div>

      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      
      <div className={appStyles.navButtonContainer}>
        <button onClick={handleBack} className={appStyles.buttonSecondary}>뒤로가기</button>
        {/* ✅ 건너뛰기 버튼 추가. 클릭 시 음악 선택 없이 다음 단계로 넘어감 */}
        <button onClick={handleNext} className={appStyles.buttonSecondary}>건너뛰기</button>
        <button onClick={handleNext} className={appStyles.buttonPrimary}>미리보기</button>
      </div>
    </div>
  );
};