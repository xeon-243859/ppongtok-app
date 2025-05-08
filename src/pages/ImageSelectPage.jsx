import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [img1, setImg1] = useState("");

  const handleImageFile = () => {
    localStorage.setItem("selected-slot", "img-1");
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
      localStorage.setItem("img-1", reader.result);
      setImg1(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const storedImg1 = localStorage.getItem("img-1");
    if (storedImg1) {
      setImg1(storedImg1);
    }
  }, []);

  return (
    <div className="image-select-container">
      <h2>
        <div>배경으로 사용할 이미지 4개를</div>
        <div>선택해주세요</div>
      </h2>

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
