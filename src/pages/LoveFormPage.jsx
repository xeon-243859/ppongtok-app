import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoveFormPage.css';

export default function LoveFormPage({ message, setMessage }) {
  const navigate = useNavigate();
  return (
    <div className="form-container">
      <h2>💌 마음속 사랑을 살며시 남겨보세요.</h2>
      <textarea
        placeholder="당신의 진심을 담은 고백을 여기에 적어주세요…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => navigate('/love/style')} disabled={!message.trim()}>
        다음으로
      </button>
    </div>
  );
}
