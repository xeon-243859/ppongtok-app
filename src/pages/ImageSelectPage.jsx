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
  const [slotIndex, setSlotIndex] = useState(1); // img-1부터 시작

  const [displayLines, setDisplayLines] = useState(["", ""]);
  const fullLine1 = "배경으로 사용할 이미지 4개를";
  const fullLine2 = "선택해주세요";

  // 타자 효과
  useEffect(() => {
    let index = 0;
    let current1 = "", current2 = "";
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

  // 이미지 불러오기
  useEffect(() => {
    setImg1(localStorage.getItem("img-1") || "");
    setImg2(localStorage.getItem("img-2") || "");
    setImg3(localStorage.getItem("img-3") || "");
    setImg4(localStorage.getItem("img-4") || "");
  }, []);

  // ✅ 이미지파일 버튼 클릭 시 자동 순번 저장 후 이동
  const handleImageFile = () => {
    const nextSlot = `img-${slotIndex}`;
    localStorage.setItem("selected-slot", nextSlot);
    setSlotIndex((prev) => (prev % 4) + 1);
    navigate("/image/theme"); // 꼭 이 위치에 있어야 작동함!
  };

  // ✅ 내파일선택
  const handleLocalFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const nextSlot = `img-${slotIndex}`;
      localStorage.setItem(nextSlot, reader.result);

      if (nextSlot === "img-1") setImg1(reader.result);
      if (nextSlot === "img-2") setImg2(reader.result);
      if (nextSlot === "img-3") setImg3(reader.result);
      if (nextSlot === "img-4") setImg4(reader.result);

      setSlotIndex((prev) => (prev % 4) + 1);
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
