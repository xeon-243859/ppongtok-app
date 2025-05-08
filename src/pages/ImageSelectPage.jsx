// src/pages/ImageSelectPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();

  const img1 = localStorage.getItem("img-1");

  return (
    <div className="image-select-container">
      <h2>배경으로 사용할 이미지 1개를<br />선택해주세요</h2>

      <div className="image-slots">
        <div className="image-slot">
          <img src={img1 || ""} alt="img-1" />
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
