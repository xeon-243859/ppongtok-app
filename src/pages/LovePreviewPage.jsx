import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/LovePreviewPage.css";

const LovePreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = location.state || {};

  return (
    <div className="preview-wrapper">
      <h2 className="preview-title">💖 완성된 고백을 미리보기 해보세요</h2>

      <div className="preview-video-container">
        {video ? (
          <video src={`/videos/${video}`} controls autoPlay loop muted className="preview-video" />
        ) : (
          <p>선택된 영상이 없습니다.</p>
        )}
      </div>

      <div className="preview-message">
        <p className="line">너를 처음 만난 그날부터</p>
        <p className="line">내 마음은 온통 너로 가득했어</p>
        <p className="line">이제는 말할게</p>
        <p className="line highlight">널 사랑해</p>
      </div>

      <div className="nav-buttons">
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <button onClick={() => alert("공유 기능은 곧 추가됩니다")}>공유하기</button>
      </div>
    </div>
  );
};

export default LovePreviewPage;
