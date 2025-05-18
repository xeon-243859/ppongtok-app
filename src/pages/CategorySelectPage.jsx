import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "memory", label: "📸 추억 만들기" },
  { id: "confess", label: "💌 사랑 고백" },
  { id: "celebrate", label: "🎉 축하하기" },
  { id: "apology", label: "🙇 사과하기" },
  { id: "thanks", label: "🙏 감사하기" }
];

export default function CategorySelectPage() {
  const navigate = useNavigate();

  const handleSelect = (categoryId) => {
    localStorage.setItem("selectedCategory", categoryId);
    navigate("/write/message");
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-rose-500 mb-10 text-center">
        어떤 마음을 전하고 싶나요?
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className="w-full bg-white text-gray-800 text-lg font-semibold py-4 px-6 rounded-xl shadow-md hover:bg-rose-100 transition"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
