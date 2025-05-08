// src/pages/ImageSelectPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [img1, setImg1] = useState(localStorage.getItem("img-1") || "");
  const [img2, setImg2] = useState(localStorage.getItem("img-2") || "");
  const [img3, setImg3] = useState(localStorage.getItem("img-3") || "");
  const [img4, setImg4] = useState(localStorage.getItem("img-4") || "");

  const [displayText, setDisplayText] = useState("");
  const fullText = "배경으로 사용할 이미지 4개를 선택해주세요";

  // 타자 효과
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + fullText[index]);
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 자동 순번 할당
  const getNextEmptySlot = () => {
    if (!img1) return "img-1";
    if (!img2) return "img-2";
    if (!img3) return "img-3";
    if (!img4) return "img-4";
    return "img-1"; // 다시 덮어쓰기
  };

  const handleImageFile = () => {
    const nextSlot = getNextEmptySlot();
    localStorage.setItem("selected-slot", nextSlot);
    navigate("/image/theme");
  };

  const handleLocalFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const nextSlot = getNextEmptySlot();
      localStorage.setItem(nextSlot, reader.result);

      if (nextSlot === "img-1") setImg1(reader.result);
      if (nextSlot === "img-2") setImg2(reader.result);
      if (nextSlot === "img-3") setImg3(reader.result);
      if (nextSlot === "img-4") setImg4(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-select-container">
      <h2>{displayText}</h2>

      <div className="file-button-group">
        <button onClick={handleImageFile}>이미지파일</button>
        <button onClick={handleLocalFile}>내파일선택</button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="image-slots">
        <div className="image-slot">
          {img1 ? <img src={img1} alt="img-1" /> : <p>img-1</p>}
          <p>img-1</p>
        </div>
        <div className="image-slot">
          {img2 ? <img src={img2} alt="img-2" /> : <p>img-2</p>}
          <p>img-2</p>
        </div>
        <div className="image-slot">
          {img3 ? <img src={img3} alt="img-3" /> : <p>img-3</p>}
          <p>img-3</p>
        </div>
        <div className="image-slot">
          {img4 ? <img src={img4} alt="img-4" /> : <p>img-4</p>}
          <p>img-4</p>
        </div>
      </div>

      <div className="button-group">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
