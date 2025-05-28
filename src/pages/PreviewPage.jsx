import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import html2canvas from "html2canvas";
import { db, storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const PreviewPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [captionText, setCaptionText] = useState("💌 뿅!톡 테스트 자막입니다");
  const [selectedMusic] = useState("/audio/spring1.mp3");
  const message = captionText;

  // 1. 이미지 + 업로드 함수
  const handleGenerateAndUploadImage = async () => {
    const target = document.getElementById("preview-target");
    if (!target) {
      alert("캡처할 요소가 없어요!");
      return;
    }

    const canvas = await html2canvas(target);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    const fileName = `preview_${Date.now()}.png`;
    const imageRef = ref(storage, `previews/${fileName}`);
    await uploadBytes(imageRef, blob);

    const downloadUrl = await getDownloadURL(imageRef);
    setGeneratedImageUrl(downloadUrl);
    console.log("🟢 이미지 저장 완료:", downloadUrl);
  };

  // 2. 전체 공유 흐름
  const handleFullShare = async () => {
    try {
      await handleGenerateAndUploadImage();

      if (!generatedImageUrl) {
        alert("이미지가 아직 준비되지 않았어요!");
        return;
      }

      const messageData = {
        imageUrl: generatedImageUrl,
        caption: captionText,
        videoUrl: null,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);
      const messageId = docRef.id;
      const shareUrl = `https://ppongtok-app.vercel.app/view/${messageId}`;

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "뿅!톡 메시지 도착 💌",
          description: "누군가 당신에게 마음을 보냈어요",
          imageUrl: messageData.imageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      });
    } catch (error) {
      console.error("❌ 전체 공유 흐름 실패:", error);
      alert("공유에 실패했어요 😢");
    }
  };

  // 3. 음악 자동 재생 (선택한 음악 있으면)
  useEffect(() => {
    if (!selectedMusic) return;
    const timer = setTimeout(() => {
      audioRef.current?.pause();
    }, 30000); // 30초 후 자동 정지
    return () => clearTimeout(timer);
  }, [selectedMusic]);

  // 4. 반복 메시지 생성 (20자 미만 시 3배)
  const repeatedMessage =
    message.length < 20 ? message.repeat(3) : message;

  return (
    <>
      {/* 공유 버튼 영역 */}
      <div>
        <img src={generatedImageUrl} alt="썸네일" />
        <p>{repeatedMessage}</p>
        <button onClick={handleFullShare}>카카오톡 공유하기</button>
      </div>

      {/* 미디어 프리뷰 영역 */}
      <div id="preview-target" className="preview-wrapper">
        <div className="preview-page">
          <div className="media-box">
            <div className="moving-box">
              {selectedMusic && (
                <audio src={selectedMusic} autoPlay ref={audioRef} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewPage;
