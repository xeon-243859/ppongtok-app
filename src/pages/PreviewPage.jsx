import React, { useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./PreviewPage.css";

function PreviewPage({ selectedImages, selectedVideo, mediaType }) {
  const [captionText, setCaptionText] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const handleFullShare = async () => {
    if (!window.Kakao || !window.Kakao.Share) {
      alert("카카오 공유 기능을 사용할 수 없어요 😢");
      return;
    }

    if (!currentUser) {
      localStorage.setItem("afterLoginRedirect", "/preview");
      alert("로그인이 필요해요 💌");
      navigate("/login");
      return;
    }

    try {
      const downloadUrl = mediaType === "image" && selectedImages && selectedImages.length > 0
        ? selectedImages[0]
        : mediaType === "video" && selectedVideo
        ? selectedVideo
        : "https://via.placeholder.com/600x400.png?text=뿅!톡";

      setGeneratedImageUrl(downloadUrl);

      const messageData = {
        imageUrl: downloadUrl,
        caption: captionText,
        videoUrl: mediaType === "video" ? selectedVideo : null,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);
      const messageId = docRef.id;

      const shareUrl = `https://ppongtok-app.vercel.app/view/${messageId}`;

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "뿅!톡 메시지 도착 💌",
          description: captionText,
          imageUrl: downloadUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      });
    } catch (error) {
      console.error("❌ 공유 실패:", error);
      alert("공유 중 오류가 발생했어요 😢");
    }
  };

  return (
    <div className="preview-wrapper">
      <div className="preview-page">
        <div className="media-box">
          <div className="moving-box">
            {mediaType === "video" && selectedVideo ? (
              <video
                src={selectedVideo}
                autoPlay
                muted
                playsInline
                className="media-display"
                onLoadedMetadata={(e) => {
                  e.target.currentTime = 0;
                  setTimeout(() => e.target.pause(), 30000);
                }}
              />
            ) : (
              selectedImages && selectedImages.length > 0 && (
                <img
                  src={selectedImages[0]}
                  alt="preview"
                  className="media-display"
                />
              )
            )}
            <div className="scrolling-caption">
              <span>{captionText}</span>
            </div>
          </div>
        </div>
        <input
          type="text"
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value)}
          placeholder="전하고 싶은 말을 입력하세요 💌"
          className="caption-input"
        />
        <button onClick={handleFullShare} className="share-button">
          카카오톡으로 공유하기
        </button>
      </div>
    </div>
  );
}

export default PreviewPage;
