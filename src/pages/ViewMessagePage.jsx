// 전체 코드 다시 안내 (위와 동일)
import React from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const ViewMessagePage = () => {
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      const messageData = {
        imageUrl: localStorage.getItem("selectedImage"),
        caption: localStorage.getItem("captionText"),
        music: localStorage.getItem("selectedMusic"),
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);
      const messageId = docRef.id;

      navigate(`/share?id=${messageId}`);
    } catch (error) {
      alert("메시지 저장에 실패했어요. 다시 시도해 주세요.");
      console.error("Error saving message:", error);
    }
  };

  const imageUrl = localStorage.getItem("selectedImage");
  const caption = localStorage.getItem("captionText");
  const music = localStorage.getItem("selectedMusic");

  return (
    <div style={{ padding: "20px" }}>
      <h2>미리보기 화면</h2>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="선택한 이미지"
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      )}

      {caption && (
        <p style={{ fontSize: "18px", marginTop: "10px" }}>{caption}</p>
      )}

      {music && (
        <audio controls style={{ marginTop: "10px" }}>
          <source src={music} type="audio/mp3" />
          브라우저가 오디오를 지원하지 않아요.
        </audio>
      )}

      <button
        onClick={handleShare}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          backgroundColor: "#ff5f5f",
          color: "#fff",
          border: "none",
        }}
      >
        공유하기
      </button>
    </div>
  );
};

export default ViewMessagePage;
