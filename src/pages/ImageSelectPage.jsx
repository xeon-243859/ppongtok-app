import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["", "", "", ""]);

  // ✅ localStorage에서 이미지 상태 복구
  useEffect(() => {
    const loaded = [1, 2, 3, 4].map(i => localStorage.getItem(`img-${i}`) || "");
    setImages(loaded);
  }, []);

  const handleDelete = (index) => {
    const updated = [...images];
    updated[index] = "";
    setImages(updated);
    localStorage.removeItem(`img-${index + 1}`);
  };

  // ✅ base64 이미지 저장 (내파일선택)
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
    alert("모든 슬롯이 가득 찼어요!");
  };

  // ✅ 이미지파일 클릭 → 비어있는 슬롯 selected-slot 설정 후 저장소 이동
  const handleImageFile = () => {
    const index = images.findIndex(img => img === "");
    if (index === -1) {
      alert("모든 슬롯이 가득 찼어요!");
      return;
    }
    const slot = `img-${index + 1}`;
    localStorage.setItem("selected-slot", slot);
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
