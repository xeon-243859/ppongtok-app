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
  const [slotIndex, setSlotIndex] = useState(1);

  const [displayLines, setDisplayLines] = useState(["", ""]);
  const fullLine1 = "배경으로 사용할 이미지 4개를";
  const fullLine2 = "선택해주세요";

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

  useEffect(() => {
    setImg1(localStorage.getItem("img-1") || "");
    setImg2(localStorage.getItem("img-2") || "");
    setImg3(localStorage.getItem("img-3") || "");
    setImg4(localStorage.getItem("img-4") || "");
    setSlotIndex(parseInt(localStorage.getItem("slot-index")) || 1);
  }, []);

  const handleImageFile = () => {
    const nextSlot = `img-${slotIndex}`;
    localStorage.setItem("selected-slot", nextSlot);
    localStorage.setItem("slot-index", (slotIndex % 4) + 1);
    setSlotIndex((slotIndex % 4) + 1);
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
      const nextSlot = `img-${slotIndex}`;
      localStorage.setItem(nextSlot, reader.result);

      const updateMap = {
        "img-1": setImg1,
        "img-2": setImg2,
        "img-3": setImg3,
        "img-4": setImg4,
      };
      updateMap[nextSlot](reader.result);

      const next = (slotIndex % 4) + 1;
      setSlotIndex(next);
      localStorage.setItem("slot-index", next);
    };
    reader.readAsDataURL(file);
  };

  const slots = [
    { key: "img-1", value: img1, set: setImg1 },
    { key: "img-2", value: img2, set: setImg2 },
    { key: "img-3", value: img3, set: setImg3 },
    { key: "img-4", value: img4, set: setImg4 },
  ];

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
        {slots.map(({ key, value, set }) => (
          <div className="image-slot" key={key}>
            {value ? (
              <>
                <img src={value} alt={key} />
                <button className="delete-button" onClick={() => {
                  localStorage.removeItem(key);
                  set("");
                }}>❌</button>
              </>
            ) : (
              <p>{key}</p>
            )}
            <p>{key}</p>
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
