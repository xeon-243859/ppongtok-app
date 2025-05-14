import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const images = [
  "/backgrounds/leaves.jpg",
  "/backgrounds/road.jpg",
  "/backgrounds/water.jpg",
  "/backgrounds/cosmos.jpg"
];

const ImageThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (src) => {
    for (let i = 1; i <= 4; i++) {
      if (!localStorage.getItem(`img-${i}`)) {
        localStorage.setItem(`img-${i}`, src);

        // ✅ 이미지 저장 후 바로 이미지 선택 페이지로 이동
        navigate("/image/select");
        return; // 첫 슬롯만 저장하고 종료
      }
    }

    // ✅ 모든 슬롯이 다 찬 경우
    alert("이미지 슬롯이 모두 찼어요!");
    navigate("/image/select");
  };

  return (
    <div className="image-theme-page">
      <h2 className="image-theme-title">이미지 테마 저장소</h2>
      <div className="image-grid">
        {images.map((src) => (
          <div key={src} className="thumbnail" onClick={() => handleSelect(src)}>
            <img src={src} alt="thumb" />
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/image/select")}>다음으로</button>
    </div>
  );
};

export default ImageThemePage;
