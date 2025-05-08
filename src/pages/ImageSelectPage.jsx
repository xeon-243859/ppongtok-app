import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["", "", "", ""]);

  // 진입 시 슬롯 초기화
  useEffect(() => {
    for (let i = 1; i <= 4; i++) {
      localStorage.removeItem(`img-${i}`);
    }
    localStorage.removeItem("selected-slot");
    setImages(["", "", "", ""]);
  }, []);

  const handleDelete = (index) => {
    const updated = [...images];
    updated[index] = "";
    setImages(updated);
    localStorage.removeItem(`img-${index + 1}`);
    if (localStorage.getItem("selected-slot") === `img-${index + 1}`) {
      localStorage.removeItem("selected-slot");
    }
  };

  const saveImage = (dataUrl) => {
    const updated = [...images];
    for (let i = 0; i < 4; i++) {
      if (!updated[i]) {
        updated[i] = dataUrl;
        setImages(updated);
        localStorage.setItem(`img-${i + 1}`, dataUrl);
        return;
      }
    }
    alert("슬롯이 가득 찼습니다!");
  };

  // ✅ 이미지파일 클릭 → 비어 있는 슬롯 찾아서 selected-slot 설정 + 저장소 이동
  const handleImageFile = () => {
    const index = images.findIndex(img => img === "");
    if (index === -1) {
      alert("모든 슬롯이 가득 찼어요!");
      return;
    }
    const slot = `img-${index + 1}`;
    localStorage.setItem("selected-slot", slot);
    console.log("👉 저장할 슬롯:", slot);
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
      saveImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-select-container">
      <h2>배경으로 사용할 이미지 4개를<br />선택해주세요</h2>

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
        {images.map((src, i) => (
          <div className="image-slot" key={i}>
            {src ? (
              <>
                <img src={src} alt={`img-${i + 1}`} />
                <button onClick={() => handleDelete(i)}>❌</button>
              </>
            ) : (
              <p>{`img-${i + 1}`}</p>
            )}
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
