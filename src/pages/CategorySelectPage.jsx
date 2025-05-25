import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  const { currentUser } = useAuth(); // 🔒 로그인 상태 확인

  const handleSelect = (value) => {
    if (!currentUser) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로
      return;
    }
   // if (!currentUser) {
   //   navigate("/login");
   //   return;
   // }

    // 로그인 되어 있으면 선택한 카테고리 저장 후 이동
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
