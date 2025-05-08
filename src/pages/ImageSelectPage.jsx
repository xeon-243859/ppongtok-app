import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");

  const [displayLines, setDisplayLines] = useState(["", ""]);
  const fullLine1 = "배경으로 사용할 이미지 4개를";
  const fullLine2 = "선택해주세요";

  useEffect(() => {
    let index = 0;
    let current1 = "";
    let current2 = "";
    const interval = setInterval(() => {
      if (index < fullLine1.length) {
        current1 += fullLine1[index];
        setDisplayLines([current1, ""]);
      } else {
        const sub = index - fullLine1.length;
        if (sub < fullLine2.length) {
          current2 += fullLine2[sub];
          setDisplayLines([current1, current2]);
        } else {
          clearInterval(interval);
        }
      }
      index++;
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setImg1(localStorage.getItem("img-1") || "");
    setImg2(localStorage.getItem("img-2") || "");
    setImg3(localStorage.getItem("img-3") || "");
    setImg4(localStorage.getItem("img-4") || "");
  }, []);

  const getNextEmptySlot = () => {
    if (!img1) return "img-1";
    if (!img2) return "img-2";
    if (!img3) return "img-3";
    if (!img4) return "img-4";
    return "img-1";
  };

  const handleImageFile = () => {
    const next = getNextEmptySlot();
    localStorage.setItem("selected-slot", next);
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
      <h2>
        {displayLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
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
        {[img1, img2, img3, img4].map((src, i) => (
          <div className="image-slot" key={i}>
            {src ? <img src={src} alt={`img-${i + 1}`} /> : <p>{`img-${i + 1}`}</p>}
            <p>{`img-${i + 1}`}</p>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
