import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./musicselectpage.module.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/firebase"; // 경로는 구조에 따라 확인


const MusicSelectPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musicName, setMusicName] = useState("");

  useEffect(() => {
    const allowed = localStorage.getItem("allow-music");
    if (allowed !== "true") {
      console.warn("🚫 비인가 접근. 스타일 선택으로 되돌림.");
      router.replace("/musicselectpage");
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

  const handleMusicFile = () => router.push("/musicthemepage");

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
    const mediaType = localStorage.getItem("media-type");
    if (mediaType === "video") {
      router.push("/videoselectpage");
    } else {
      router.push("/imageselectpage");
    }
  };

  const handleNext = async () => {
  const selectedType = localStorage.getItem("selected-type");
  const messageId = localStorage.getItem("message-id");

  if (!messageId || !selectedType) {
    alert("🚫 메시지 정보가 없습니다. 이전 단계로 돌아갑니다.");
    router.push("/loveformpage");
    return;
  }

  const message = localStorage.getItem("message") || "";
  const caption = localStorage.getItem("caption") || "";
  const music = localStorage.getItem("selected-music") || "";
  const type = selectedType;

  let payload = {
    message,
    caption,
    music,
    type,
  };

  if (type === "video") {
    const videoUrl = localStorage.getItem("selected-video");
    payload.videoUrl = videoUrl; // ✅ 문자열로 저장
  } else if (type === "image") {
    const imageUrls = JSON.parse(localStorage.getItem("selectedImages") || "[]");
    payload.imageurls = imageUrls; // ✅ 이미지 배열
  }

  try {
    await setDoc(doc(db, "messages", messageId), payload);
    console.log("✅ Firestore 저장 완료");
    router.push(`/view/${messageId}`);
  } catch (error) {
    console.error("🔥 Firestore 저장 오류:", error);
    alert("메시지 저장에 실패했습니다. 다시 시도해주세요.");
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
        <button onClick={handleNext}>미리보기</button>
      </div>
    </div>
  );
};

export default MusicSelectPage;
