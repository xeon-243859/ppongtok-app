import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { getFirestore, doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import "./PreviewPage.css";

function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const db = getFirestore();

  const [captionText, setCaptionText] = useState("💌 뿅!톡 테스트 자막입니다");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaType, setMediaType] = useState("none");

  const params = new URLSearchParams(location.search);
  const forcedMediaType = params.get("type");

  const selectedVideo = localStorage.getItem("selected-video");
  const selectedMusic = localStorage.getItem("selected-music");
  const audioRef = useRef(null);

  const handleFullShare = async () => {
    if (!currentUser) {
      localStorage.setItem("afterLoginRedirect", "/preview");
      alert("로그인이 필요해요 💌");
      navigate("/login");
      return;
    }

    const target = document.getElementById("preview-target");
    if (!target) {
      alert("캡처할 요소가 없어요!");
      return;
    }

    try {
      // 이미지 캡처 및 업로드
      const canvas = await html2canvas(target);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      const fileName = `preview_${Date.now()}.png`;
      const imageRef = ref(storage, `previews/${fileName}`);
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);
      setGeneratedImageUrl(downloadUrl);

      // 메시지 저장
      const messageData = {
        imageUrl: downloadUrl,
        caption: captionText,
        videoUrl: selectedVideo || null,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);
      const messageId = docRef.id;
      const shareUrl = `https://ppongtok-app.vercel.app/view/${messageId}`;

      // 카카오톡 공유
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "뿅!톡 메시지 도착 💌",
          description: "누군가 당신에게 마음을 보냈어요",
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

  const handleGoHome = () => {
    navigate("/");
  };

  const handleNext = async () => {
    if (!currentUser) {
      alert("로그인이 필요해요 💌");
      navigate("/login");
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("유저 정보가 없습니다.");
      return;
    }

    const freePass = userSnap.data().freePassCount || 0;

    if (freePass > 0) {
      await updateDoc(userRef, { freePassCount: freePass - 1 });
      navigate("/share");
    } else {
      alert("무료 이용권이 모두 소진되었습니다. 결제가 필요해요 🛍️");
      navigate("/payment");
    }
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) setMessage(storedMessage);
  }, []);

  useEffect(() => {
    const rawImages = JSON.parse(localStorage.getItem("selected-images") || "[]");
    const validImages = Array.isArray(rawImages) ? rawImages.filter((img) => typeof img === "string" && img.trim() !== "") : [];
    setSelectedImages(validImages);

    const hasImages = validImages.length > 0;
    const hasVideo = selectedVideo && selectedVideo !== "null" && selectedVideo !== "";

    if (forcedMediaType === "image" && hasImages) {
      setMediaType("image");
    } else if (forcedMediaType === "video" && hasVideo) {
      setMediaType("video");
    } else if (hasImages) {
      setMediaType("image");
    } else if (hasVideo) {
      setMediaType("video");
    } else {
      setMediaType("none");
    }
  }, [forcedMediaType]);

  useEffect(() => {
    if (mediaType !== "image" || selectedImages.length === 0) return;
    let index = 0;
    setCurrentImageIndex(index);
    const interval = setInterval(() => {
      index = (index + 1) % selectedImages.length;
      setCurrentImageIndex(index);
    }, 5000);
    const timeout = setTimeout(() => clearInterval(interval), 30000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [mediaType, selectedImages]);

  useEffect(() => {
    if (!audioRef.current) return;
    const timer = setTimeout(() => {
      audioRef.current.pause();
    }, 30000);
    return () => clearTimeout(timer);
  }, [selectedMusic]);

  const repeatedMessage = message.length < 20 ? message.repeat(3) : message;

  return (
    <>
      <div>
        <img src={generatedImageUrl} alt="썸네일" />
        <p>{captionText}</p>
        <button onClick={handleFullShare}>카카오톡 공유하기</button>
      </div>

      <div id="preview-target" className="preview-wrapper">
        <div className="preview-page">
          <div className="media-box">
            <div className="moving-box">
              {mediaType === "image" && selectedImages.length > 0 ? (
                <img src={selectedImages[currentImageIndex]} alt="preview" className="media-display" />
              ) : mediaType === "video" ? (
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
                <div className="media-fallback">배경이 없습니다</div>
              )}
              <div className="scrolling-caption">
                <span>{repeatedMessage}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="under-media-buttons">
          <button className="nav-button" onClick={() => (window.location.href = "/music")}>뒤로가기</button>
          <button className="nav-button" onClick={handleNext}>다음 - 공유하기</button>
        </div>

        <div className="go-home-button-wrapper">
          <button className="go-home-button" onClick={handleGoHome}>처음으로</button>
        </div>

        {selectedMusic && <audio src={selectedMusic} autoPlay ref={audioRef} />}
      </div>
    </>
  );
}

export default PreviewPage;

