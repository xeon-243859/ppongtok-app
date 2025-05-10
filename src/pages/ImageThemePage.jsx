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
    for (let i = 1; i <= 4; i++) {
      const key = `img-${i}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, src);
        break;
      }
    }
    navigate("/image/select");
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
