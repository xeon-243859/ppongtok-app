// src/pages/ImageSelectPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const [img1, setImg1] = useState("");
  const [displayText, setDisplayText] = useState("");
  const fullTextLine1 = "배경으로 사용할 이미지 1개를";
  const fullTextLine2 = "선택해주세요";

  useEffect(() => {
    // 타자 효과 - 줄별로 처리
    let index = 0;
    let currentText = "";
    const interval = setInterval(() => {
      if (index < fullTextLine1.length) {
        currentText += fullTextLine1[index];
        setDisplayText(currentText);
        index++;
      } else if (index === fullTextLine1.length) {
        setDisplayText(currentText + "\n" + fullTextLine2[0]);
        index++;
      } else {
        const subIndex = index - fullTextLine1.length;
        if (subIndex < fullTextLine2.length) {
          setDisplayText(currentText + "\n" + fullTextLine2.slice(0, subIndex + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedImg1 = localStorage.getItem("img-1");
    if (storedImg1) {
      setImg1(storedImg1);
    }
  }, []);

  return (
    <div className="image-select-container">
      <h2>
        {displayText.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </h2>

      <div className="file-button-group">
        <button onClick={() => navigate("/image/theme")}>이미지파일</button>
        <button onClick={() => navigate("/image/theme")}>내파일선택</button>
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
