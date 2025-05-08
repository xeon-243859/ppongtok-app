import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSelectPage.css";

const ImageSelectPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(["", "", "", ""]);

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

  // 페이지 진입 시 localStorage → 상태 동기화
  useEffect(() => {
    const loaded = [1, 2, 3, 4].map(i => localStorage.getItem(`img-${i}`) || "");
    setImages(loaded);

    // selected-slot 정리
    const selected = localStorage.getItem("selected-slot");
    if (selected) {
      const index = parseInt(selected.split("-")[1]) - 1;
      if (!loaded[index]) {
        localStorage.removeItem("selected-slot");
      }
    }
  }, []);

  // 이미지 삭제
  const handleDelete = (index) => {
    const updated = [...images];
    updated[index] = "";
    setImages(updated);
    localStorage.removeItem(`img-${index + 1}`);

    // 선택된 슬롯이 이 슬롯이었다면 초기화
    if (localStorage.getItem("selected-slot") === `img-${index + 1}`) {
      localStorage.removeItem("selected-slot");
    }
  };

  // ✅ 가장 먼저 비어 있는 슬롯을 찾아 정확히 저장
  const saveImage = (dataUrl) => {
    const updated = [...images];

    for (let i = 0; i < updated.length; i++) {
      if (!updated[i]) {
        updated[i] = dataUrl;
        setImages(updated);
        localStorage.setItem(`img-${i + 1}`, dataUrl);
        return;
      }
    }

    alert("슬롯이 모두 가득 찼어요!");
  };

  // 이미지파일 선택 → 이미지 테마 저장소로 이동
  const handleImageFile = () => {
    const index = images.findIndex(img => img === "");
    if (index === -1) {
      alert("모든 슬롯이 가득 찼어요!");
      return;
    }
    localStorage.setItem("selected-slot", `img-${index + 1}`);
    navigate("/image/theme");
  };

  // 내 파일 선택
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
        {images.map((src, i) => (
          <div className="image-slot" key={i}>
            {src ? (
              <>
                <img src={src} alt={`img-${i + 1}`} />
                <button className="delete-button" onClick={() => handleDelete(i)}>❌</button>
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
