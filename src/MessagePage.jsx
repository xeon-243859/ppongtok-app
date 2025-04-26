import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MessagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { emotion } = location.state || {};

  const [category, setCategory] = useState("사랑 고백");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      // ✅ localStorage에 상태 백업 저장
      localStorage.setItem("previewState", JSON.stringify({
        emotion,
        category,
        message,
      }));

      // ✅ 정상 navigate
      navigate("/preview", {
        state: {
          emotion,
          category,
          message,
        },
      });
    } else {
      alert("메시지를 입력해주세요!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-pink-50">
      <h1 className="text-3xl font-bold mb-4">✨ 감성 메시지를 입력해보세요 ✨</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <label className="block mb-2 text-lg font-semibold">카테고리 선택</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option>사랑 고백</option>
          <option>사과</option>
          <option>축하</option>
          <option>추억 만들기</option>
          <option>감사 인사</option>
        </select>

        <label className="block mb-2 text-lg font-semibold">메시지 입력</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="당신의 마음을 담아 메시지를 써보세요..."
          className="w-full p-3 border rounded resize-none mb-6"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-pink-500 text-white font-bold rounded hover:bg-pink-600 transition"
        >
          미리보기 & 다음 단계로 →
        </button>
      </div>
    </div>
  );
};

export default MessagePage;
