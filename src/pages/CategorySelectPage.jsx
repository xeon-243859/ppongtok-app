import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "memory",
    title: "추억 만들기",
    description: "함께한 순간들을 기록해요",
    image: "/images/category_memory.jpg"
  },
  {
    id: "confess",
    title: "사랑 고백",
    description: "마음을 전하는 설레는 고백",
    image: "/images/category_confess.jpg"
  },
  {
    id: "celebrate",
    title: "축하하기",
    description: "기쁨을 함께 나누어요",
    image: "/images/category_celebrate.jpg"
  },
  {
    id: "apology",
    title: "사과하기",
    description: "진심 어린 미안함을 전해요",
    image: "/images/category_apology.jpg"
  },
  {
    id: "thanks",
    title: "감사하기",
    description: "고마운 마음을 전해요",
    image: "/images/category_thanks.jpg"
  }
];

export default function CategorySelectPage() {
  const navigate = useNavigate();

  const handleSelect = (categoryId) => {
    localStorage.setItem("selectedCategory", categoryId);
    navigate("/write/message");
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 mt-4 text-center text-rose-500">
        어떤 마음을 전하고 싶나요?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleSelect(cat.id)}
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{cat.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
