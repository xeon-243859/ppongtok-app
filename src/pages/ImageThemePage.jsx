import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageThemePage.css";

const themes = [
  { id: "img01", src: "/backgrounds/cosmos.jpg" },
  { id: "img02", src: "/backgrounds/leaves.jpg" },
  { id: "img03", src: "/backgrounds/road.jpg" },
  { id: "img04", src: "/backgrounds/water.jpg" },
];

const ImageThemePage = () => {
  const navigate = useNavigate();

  const handleSelect = (src) => {
  console.log("🖱️ 이미지 클릭됨! src:", src);  // ✅ 이거 추가 
  for (let i = 1; i <= 4; i++) {
    const key = `img-${i}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, src); // 슬롯 저장
      break;
    }
  }

  localStorage.setItem("selected-image", src);  // ✅ 대표 이미지 항상 저장
  localStorage.removeItem("selected-video");    // ✅ 영상 제거 (중복 방지)
  console.log("🌅 대표 이미지 저장됨:", src);

  navigate("/image/select"); // 또는 다음 페이지
};


  return (
    <div className="theme-container">
      <h2 className="theme-title">이미지 테마 저장소</h2>

      <div className="theme-grid">
        {themes.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt={img.id}
            className="theme-thumb"
            onClick={() => handleSelect(img.src)}
          />
        ))}
      </div>

      <div className="theme-buttons">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => navigate("/music/select")}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageThemePage;
