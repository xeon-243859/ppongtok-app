import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmotionPage = () => {
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState("");

  const emotions = [
    { label: "설렘", emoji: "💘" },
    { label: "행복", emoji: "😊" },
    { label: "미안함", emoji: "🥲" },
    { label: "뿌듯함", emoji: "😌" },
    { label: "그리움", emoji: "😢" }
  ];

  const handleNext = () => {
    if (emotion) {
      navigate("/message", { state: { emotion } });
    } else {
      alert("감정을 하나 선택해주세요!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-yellow-50">
      <h1 className="text-3xl font-bold mb-6">💭 지금 당신의 감정은?</h1>

      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-sm">
        {emotions.map((e) => (
          <button
            key={e.label}
            onClick={() => setEmotion(e.label)}
            className={`p-4 rounded-xl text-xl font-semibold border ${
              emotion === e.label ? "bg-yellow-300" : "bg-white"
            } hover:bg-yellow-200 transition`}
          >
            {e.emoji} {e.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-full max-w-sm py-3 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 transition"
      >
        다음 단계로 →
      </button>
    </div>
  );
};

export default EmotionPage;


