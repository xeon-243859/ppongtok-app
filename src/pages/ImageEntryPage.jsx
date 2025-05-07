// ImageEntryPage.jsx - 이미지파일 진입화면
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageEntryPage.css";

const ImageEntryPage = () => {
  const navigate = useNavigate();

  const handleEnterImageStorage = () => {
    navigate("/image/select");
  };

  return (
    <div className="image-entry-container">
      <div className="image-entry-header">
        <button className="entry-button" onClick={handleEnterImageStorage}>이미지파일</button>
        <button className="entry-button">내파일선택</button>
      </div>

      <div className="image-slot">Img-01</div>
      <div className="image-slot">Img-02</div>
      <div className="image-slot">Img-03</div>
      <div className="image-slot">Img-04</div>

      <div className="entry-footer">
        <button className="entry-button" onClick={() => navigate(-1)}>뒤로가기</button>
        <button className="entry-button" onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageEntryPage;
