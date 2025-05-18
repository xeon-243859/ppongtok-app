// /pages/StartPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-rose-100 p-6">
      <h1 className="text-4xl font-bold text-rose-600 mb-8">뿅!톡</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-md">
        당신의 마음을 특별하게 전하세요.  
        추억, 사랑, 감사, 축하, 사과의 메시지를 감성적으로 담아보세요.
      </p>
      <button
        onClick={() => navigate("/select-category")}
        className="bg-rose-500 text-white text-xl px-8 py-4 rounded-full shadow-lg hover:bg-rose-600 transition"
      >
        시작하기
      </button>
    </div>
  );
}
