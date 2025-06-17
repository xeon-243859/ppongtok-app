import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";
import styles from "../../src/styles/viewpreview.module.css";

export default function ViewMessagePreviewPage() {
  const [messageData, setMessageData] = useState(null);
  const audioRef = useRef(null);
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          console.log("❌ 메시지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("🔥 메시지 불러오기 오류:", error);
      }
    };

    fetchData();
  }, [router.isReady, id]);

  if (!messageData) return <p>로딩 중...</p>;

  return (
    <>
      <Head>
        <title>미리보기</title>
      </Head>

      <div className={styles["preview-container"]}>
        <h2 className={styles["preview-title"]}>미리보기</h2>

        <div className={styles["moving-box"]}>
          {/* 🎥 영상 */}
          {messageData.type === "video" && messageData.videoUrl && (
            <video
              src={messageData.videoUrl}
              controls
              autoPlay
              className={styles["media-element"]}
              style={{ backgroundColor: "#000" }}
            />
          )}

          {/* 🖼️ 이미지 */}
          {messageData.type === "image" &&
            Array.isArray(messageData.imageurls) &&
            messageData.imageurls.length > 0 && (
              <>
                {messageData.imageurls.map((img, index) => (
                  <img
                    key={index}
                    src={img.startsWith("data:image") ? img : `data:image/jpeg;base64,${img}`}
                    alt={`img-${index + 1}`}
                    className={styles["media-element"]}
                  />
                ))}
              </>
            )}

          {/* 💬 자막 */}
          {messageData.message && messageData.message !== "🌿" && (
            <div className={styles["caption-scroll-container"]}>
              <div className={styles["caption-scroll"]}>
                {messageData.message}
              </div>
            </div>
          )}
        </div>

        {/* 🔘 버튼 그룹 */}
        <div className={styles["button-group"]}>
          <button className={styles["action-button"]} onClick={() => router.back()}>
            ⬅ 뒤로가기
          </button>
          <button className={styles["action-button"]} onClick={() => router.push("/")}>
            🏠 처음으로
          </button>
          <button
            disabled={!router.isReady || !id}
            className={styles["action-button"]}
            onClick={() => {
              if (router.isReady && id) {
                router.push(`/share/${id}`);
              } else {
                alert("❗ 공유 링크를 아직 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
              }
            }}
          >
            📤 공유하기
          </button>
        </div>

        {/* 🎵 음악 */}
        {messageData.music && (
          <audio ref={audioRef} src={messageData.music} controls autoPlay />
        )}
      </div>
    </>
  );
}
