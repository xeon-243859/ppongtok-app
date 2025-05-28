import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

function PreviewPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [captionText, setCaptionText] = useState(localStorage.getItem("message") || "");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(localStorage.getItem("selectedMusic") || "");
  const [mediaType, setMediaType] = useState(localStorage.getItem("mediaType") || "image");
  const audioRef = useRef(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const images = localStorage.getItem("selectedImages");
    if (images) {
      try {
        setSelectedImages(JSON.parse(images));
      } catch (e) {
        console.error("이미지 파싱 실패:", e);
      }
    }

    const video = localStorage.getItem("selectedVideo");
    if (video) setSelectedVideo(video);
  }, []);

  useEffect(() => {
    if (audioRef.current && selectedMusic) {
      audioRef.current.play();
      const timeout = setTimeout(() => {
        audioRef.current.pause();
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [selectedMusic]);

  const uploadMedia = async () => {
    const storage = getStorage();
    const mediaRef = ref(storage, `media/${Date.now()}`);
    const mediaUrl = mediaType === "image" ? selectedImages[0] : selectedVideo;
    const uploadType = mediaUrl.startsWith("data:image") ? "data_url" : "base64";

    await uploadString(mediaRef, mediaUrl, uploadType);
    return await getDownloadURL(mediaRef);
  };

  const handleNext = async () => {
    if (!currentUser) {
      localStorage.setItem("afterLoginRedirect", "/preview");
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

      const uploadedUrl = await uploadMedia();

      const messageRef = await addDoc(collection(db, "messages"), {
        caption: captionText,
        imageUrl: mediaType === "image" ? uploadedUrl : "",
        videoUrl: mediaType === "video" ? uploadedUrl : "",
        musicUrl: selectedMusic,
        createdAt: new Date(),
      });

      navigate(`/share?id=${messageRef.id}`);
    } else {
      alert("무료 이용권이 모두 소진되었습니다. 결제가 필요해요 💳");
      navigate("/payment");
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
          onChange={(e) => {
            setCaptionText(e.target.value);
            localStorage.setItem("message", e.target.value);
          }}
          placeholder="전하고 싶은 말을 입력하세요 💌"
          className="caption-input"
        />
        <div className="preview-buttons">
          <button onClick={() => navigate(-1)}>뒤로가기</button>
          <button onClick={handleNext}>다음 - 공유하기</button>
          <button onClick={() => navigate("/")}>처음으로</button>
        </div>
        <audio ref={audioRef} src={selectedMusic} loop />
      </div>
    </div>
  );
}

export default PreviewPage;
