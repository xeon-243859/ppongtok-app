import React, { useEffect, useState } from "react";
import "./PreviewPage.css"; // 동일 폴더 안에 있어야 함

const PreviewPage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("message");
    console.log("📝 불러온 메시지:", msg);
    setMessage(msg || "");
  }, []);

  return (
    <div className="preview-page">
      <div className="preview-subtitle">
        {message ? message : "메시지가 없습니다."}
      </div>
    </div>
  );
};

export default PreviewPage;
