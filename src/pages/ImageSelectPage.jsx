import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ImageSelectPage.css";

const categories = ["따뜻한", "설레임", "그리움", "감성적인", "내파일선택"];

const sampleImages = {
  따뜻한: ["warm1.jpg", "warm2.jpg", "warm3.jpg", "warm4.jpg"],
  설레임: ["love1.jpg", "love2.jpg", "love3.jpg", "love4.jpg"],
  그리움: ["miss1.jpg", "miss2.jpg", "miss3.jpg", "miss4.jpg"],
  감성적인: ["emo1.jpg", "emo2.jpg", "emo3.jpg", "emo4.jpg"],
};

const ImageSelectPage = () => {
  const [activeTab, setActiveTab] = useState("따뜻한");
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  const handleImageClick = (img) => {
    if (selectedImages.includes(img)) return;
    if (selectedImages.length < 4) {
      setSelectedImages([...selectedImages, img]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedImages.length < 4) {
      const url = URL.createObjectURL(file);
      setSelectedImages([...selectedImages, url]);
    }
  };

  const handleBack = () => window.history.back();

  const handleNext = () => {
    if (selectedImages.length === 4) {
      navigate("/video/select"); // ✅ 여기 수정됨!
    } else {
      alert("4개의 이미지를 선택해 주세요!");
    }
  };

  return (
    <div className="image-select-wrapper">
      <div className="tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeTab === cat ? "tab active" : "tab"}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
        {activeTab === "내파일선택" && (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        )}
      </div>

      {activeTab !== "내파일선택" && (
        <div className="image-grid">
          {sampleImages[activeTab].map((img) => (
            <img
              key={img}
              src={`/backgrounds/${img}`}
              alt={img}
              className={selectedImages.includes(img) ? "selected" : ""}
              onClick={() => handleImageClick(img)}
            />
          ))}
        </div>
      )}

      <div className="selected-box">
        {Array(4)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} className="box-slot">
              {selectedImages[idx] && (
                <img
                  src={
                    selectedImages[idx].startsWith("blob")
                      ? selectedImages[idx]
                      : `/backgrounds/${selectedImages[idx]}`
                  }
                  alt="selected"
                />
              )}
            </div>
          ))}
      </div>

      <div className="nav-buttons">
        <button onClick={handleBack}>뒤로가기</button>
        <button onClick={handleNext}>다음으로</button>
      </div>
    </div>
  );
};

export default ImageSelectPage;
