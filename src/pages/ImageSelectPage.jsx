// src/pages/ImageSelectPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [img1, setImg1] = useState("");

  // 타자 효과를 위한 상태
  const [displayText, setDisplayText] = useState("");
  const fullText = "배경으로 사용할 이미지 1개를 선택해주세요";

  // 타자 애니메이션
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + fullText[index]);
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 이미지 로드
  useEffect(() => {
    const storedImg1 = localStorage.getItem("img-1");
    if (storedImg1) {
      setImg1(storedImg1);
    }
  }, []);

  return (
    <div className="image-select-container">
      <h2>{displayText}</h2>

      <div className="file-button-group">
        <button disabled>이미지파일</button>
        <button disabled>내파일선택</button>
      </div>

      <div className="image-slots">
        <div className="image-slot">
          {img1 ? <img src={img1} alt="img-1" /> : <p>img-1</p>}
          <p>img-1</p>
        </div>
        <div className="image-slot"><p>img-2</p></div>
        <div className="image-slot"><p>img-3</p></div>
        <div className="image-slot"><p>img-4</p></div>
      </div>

      <div className="button-group">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
