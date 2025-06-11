import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

export default function ViewMessagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    // ✅ 임시 더미 데이터
    setMessageData({
      caption: "이건 공유된 메시지입니다.",
      mediaType: "image", // "image" or "video"
      media: "https://via.placeholder.com/800x450?text=배경미디어",
      music: "/audio/spring1.mp3", // public 디렉토리 기준 경로
    });
  }, [id]);

  useEffect(() => {
    if (!messageData) return;

    // 30초 후 자동 종료
    const timeout = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [messageData]);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 800, margin: "auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>💌 메시지 보기</h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "24px",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {messageData.mediaType === "image" ? (
          <img
            src={messageData.media}
            alt="배경 이미지"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <video
            ref={videoRef}
            src={messageData.media}
            autoPlay
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            width: "100%",
            textAlign: "center",
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            textShadow: "0 0 8px rgba(0,0,0,0.8)",
          }}
        >
          {messageData.caption}
        </div>
      </div>

      {messageData.music && (
        <audio ref={audioRef} src={messageData.music} autoPlay />
      )}
    </div>
  );
}
