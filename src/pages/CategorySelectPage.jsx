import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategorySelectPage.css";

const categories = [
  { label: "추억 만들기", value: "memory" },
  { label: "사랑 고백", value: "love" },
  { label: "축하하기", value: "celebrate" },
  { label: "사과하기", value: "apology" },
  { label: "감사하기", value: "thanks" },
];

const CategorySelectPage = () => {
  const navigate = useNavigate();

  const handleSelect = (value) => {
    localStorage.setItem("selected-category", value);
    navigate("/write/message");
  };

  return (
    <div className="category-page">
      <h2 className="category-title">어떤 마음을 전하고 싶나요?</h2>
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className="category-button"
            onClick={() => handleSelect(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelectPage;
