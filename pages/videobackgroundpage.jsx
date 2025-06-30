import React, { useState } from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter
import styles from "@/styles/videobackgroundpage.module.css"; // ✅ module.css import

const videos = [
  "/videos/flower.mp4",
  "/videos/river.mp4",
  "/videos/sky.mp4",
  "/videos/sunset.mp4",
];

export default function VideoBackgroundPage({ setSelectedVideo }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const handleSelect = (vid) => {
    setSelected(vid);
    setSelectedVideo(vid);
  };

  return (
    <div className={styles.videoBackgroundContainer}>
      <h2>영상 배경을 선택해 주세요</h2>

      <div className={styles.videoPreview}>
        {selected && (
          <video
            src={selected}
            autoPlay
            muted
            loop
            controls
            width="320"
            height="180"
          />
        )}
      </div>

      <div className={styles.videoOptions}>
        {videos.map((vid, index) => (
          <button
            key={index}
            className={selected === vid ? styles.selected : ""}
            onClick={() => handleSelect(vid)}
          >
            영상 {index + 1}
          </button>
        ))}
      </div>

      <div className={styles.navigationButtons}>
        <button onClick={() => router.push("/love/style")}>뒤로가기</button>
        <button
          onClick={() => router.push("/preview")}
          disabled={!selected}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
