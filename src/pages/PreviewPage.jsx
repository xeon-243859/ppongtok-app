// ✅ PreviewPage.jsx - localStorage 기반으로 리팩토링 완료 (원본 최대 유지)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const PreviewPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [mediaType, setMediaType] = useState("");

  useEffect(() => {
    const images = JSON.parse(localStorage.getItem("selectedImages")) || [];
    const video = localStorage.getItem("selectedVideo") || "";
    const caption = localStorage.getItem("captionText") || "";
    const type = localStorage.getItem("mediaType") || "";
    setSelectedImages(images);
    setSelectedVideo(video);
    setCaptionText(caption);
    setMediaType(type);
  }, []);

  const handleNext = async () => {
    console.log("🔐 currentUser:", currentUser);

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

      const downloadUrl = mediaType === "image" && selectedImages.length > 0
        ? selectedImages[0]
        : mediaType === "video" && selectedVideo
        ? selectedVideo
        : "https://via.placeholder.com/600x400.png?text=뿅!톡";

      const messageData = {
        imageUrl: downloadUrl,
        caption: captionText,
        videoUrl: selectedVideo || null,
        createdAt: new Date(),
      };

      try {
        const docRef = await addDoc(collection(db, "messages"), messageData);
        const messageId = docRef.id;
        const shareUrl = `https://ppongtok-app.vercel.app/api/view/${messageId}`; // <-- 여기로 바꿔야 해!
        console.log("✅ messageId:", messageId);
        window.open(shareUrl, "_blank");
      } catch (error) {
        console.error("❌ 메시지 저장 실패:", error);
        alert("메시지 저장에 실패했어요. 다시 시도해 주세요.");
      }
    } else {
      alert("무료 이용권이 모두 소진되었습니다. 결제가 필요해요 🛍️");
      navigate("/payment");
    }
  };

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <h1>미리보기 화면</h1>
      {mediaType === "image" && selectedImages && selectedImages.length > 0 && (
        <img src={selectedImages[0]} alt="선택 이미지" style={{ maxWidth: "100%", marginBottom: "16px" }} />
      )}
      {mediaType === "video" && selectedVideo && (
        <video src={selectedVideo} controls style={{ width: "100%", marginBottom: "16px" }} />
      )}
      <p style={{ marginBottom: "24px" }}>{captionText}</p>
      <button onClick={handleNext} style={{ fontSize: "16px", padding: "10px 20px" }}>다음 공유하기</button>
    </div>
  );
};

export default PreviewPage;
