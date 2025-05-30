// ✅ PreviewPage.jsx - 원본 최대 유지 + 상단 썸네일/자막/공유버튼 제거 + currentUser 로그 추가

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { getFirestore, doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { db , storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import "./PreviewPage.css";

function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const db = getFirestore();

  const handleShare = async () => {
    try {
      const caption = localStorage.getItem("caption");
      const target = document.getElementById("preview-content");

      if (!target) {
        alert("프리뷰 영역을 찾을 수 없습니다.");
        return;
      }

      const canvas = await html2canvas(target);
      const dataUrl = canvas.toDataURL("image/png");
      console.log("📸 캡처 dataUrl 길이:", dataUrl.length);
      if (!dataUrl || dataUrl.length < 100) {
  alert("이미지 캡처에 실패했어요. 다시 시도해주세요.");
  return;
}
      const fileRef = ref(storage, `previews/${Date.now()}.png`);
      console.log("📌 업로드 시작");
      await uploadString(fileRef, dataUrl, "data_url");
      console.log("✅ 업로드 성공, 이미지 URL 생성 시도");
      const imageUrl = await getDownloadURL(fileRef);
      console.log("🎯 최종 imageUrl:", imageUrl);

    

      const docRef = await addDoc(collection(db, "messages"), {
        imageUrl,
        caption,
        createdAt: new Date(),
      });

      const messageId = docRef.id;
      console.log("🚀 공유 페이지로 이동할 messageId:", messageId);
      const shareUrl = `https://ppongtok-app.vercel.app/view/${messageId}`;

      window.open(shareUrl, "_blank");
    } catch (error) {
      console.error("❌ 메시지 저장 실패:", error);
      alert("메시지 저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("4abf45cca92e802defcd2c15a6615155");
      console.log("✅ Kakao SDK 초기화 완료");
    }
  }, []);

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
      const downloadUrl = mediaType === "image" && selectedImages.length > 0
        ? selectedImages[0]
        : mediaType === "video" && selectedVideo
        ? selectedVideo
        : "https://via.placeholder.com/600x400.png?text=뿅!톡";

      setGeneratedImageUrl(downloadUrl);

      const messageData = {
        imageUrl: downloadUrl,
        caption: captionText,
        videoUrl: selectedVideo || null,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);
      const messageId = docRef.id;
      
      console.log("✅ 저장된 Firestore 문서 ID:", messageId);

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

      return messageId;
    } catch (error) {
      console.error("❌ 공유 실패:", error);
      alert("공유 중 오류가 발생했어요 😢");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

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
    console.log("🔍 Firestore에서 확인된 존재 여부:", docSnap.exists());
    if (!userSnap.exists()) {
      alert("유저 정보가 없습니다.");
      return;
    }

    const freePass = userSnap.data().freePassCount || 0;

    if (freePass > 0) {
      await updateDoc(userRef, { freePassCount: freePass - 1 });

      // 🔒 공유 실행 제거: Firestore 저장만 수행
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
       // ✅ 이 부분에 콘솔 로그 추가!
    console.log("💬 messageData:", messageData);
    console.log("📸 downloadUrl:", downloadUrl);
    console.log("🎬 selectedVideo:", selectedVideo);
    console.log("🖼️ selectedImages:", selectedImages);
    console.log("🧭 mediaType:", mediaType);


      try {
        const docRef = await addDoc(collection(db, "messages"), messageData);
        const messageId = docRef.id;
        console.log("✅ messageId:", messageId);
        navigate(`/view/${messageId}`);
      } catch (error) {
        console.error("❌ 메시지 저장 실패:", error);
        alert("메시지 저장에 실패했어요. 다시 시도해 주세요.");
      }

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
  <div className="preview-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
    <h2 style={{ marginBottom: "16px" }}>💌 미리보기</h2>

    {/* ✅ 무빙박스 (이미지 or 영상 + 자막) */}
    <div className="moving-box" style={{
    width: "80%",             // 💡 가로 너비를 부모 요소(보통 화면 전체)에 맞춤. 반응형 적용됨
    maxWidth: "300px",         // 📏 너무 커지지 않게 최대 너비 제한 (데스크탑용)
    minHeight: "360px",        // 🔳 콘텐츠가 없을 때도 일정 높이를 유지하여 레이아웃 안정화
    background: "#fff",        // 🎨 배경색 (흰색), 박스를 강조
    borderRadius: "24px",      // 🌿 둥근 모서리로 감성적인 느낌
    padding: "16px",           // 🧱 내부 여백 확보 (이미지/자막이 바깥에 닿지 않게)
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",  // ☁️ 그림자 효과로 입체감 부여
    textAlign: "center"        // 📌 자막 등 텍스트를 가운데 정렬
    }}>
      {/* 🎬 미디어 렌더링 */}
      {mediaType === "image" && selectedImages.length > 0 ? (
        <img
          src={selectedImages[currentImageIndex]}
          alt="preview"
          style={{ width: "100%", borderRadius: "16px" }}
        />
      ) : mediaType === "video" && selectedVideo ? (
        <video
          src={selectedVideo}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", borderRadius: "16px" }}
          onLoadedMetadata={(e) => {
            e.target.currentTime = 0;
            setTimeout(() => e.target.pause(), 30000);
          }}
        />
      ) : (
        <div style={{ height: "200px", display: "flex", justifyContent: "center", alignItems: "center", color: "#999" }}>
          배경이 없습니다
        </div>
      )}

      {/* ✨ 자막 */}
      <div style={{
        marginTop: "16px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        height: "32px",               // ✨ 자막 줄 높이 확보
        lineHeight: "32px"            // ✨ 텍스트 정렬
      }}>
        <span style={{
          display: "inline-block",
          animation: "scrollText 30s linear infinite",// ✅ 여기 숫자가 클수록 느려요!
          fontSize: "18px"
        }}>
          {repeatedMessage}
        </span>
      </div>
    </div>

    {/* ✅ 버튼은 무빙박스 아래 */}
    <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
      <button onClick={() => navigate("/music")} style={buttonStyle}>뒤로가기</button>
      <button onClick={handleNext} style={buttonStyle}>다음 - 공유하기</button>
      <button onClick={handleGoHome} style={buttonStyle}>처음으로</button>
    </div>

    {/* ✅ 음악 오디오 */}
    {selectedMusic && <audio ref={audioRef} src={selectedMusic} autoPlay loop />}
  </div>
);

}
const buttonStyle = {
  padding: "12px 20px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#ff8fab",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
};

export default PreviewPage;


