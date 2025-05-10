import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinPage.css";

const JoinPage = () => {
  const navigate = useNavigate();
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("sender", sender);
    localStorage.setItem("receiver", receiver);
    localStorage.setItem("email", email);
    navigate("/love");
  };

  const handleSkip = () => {
    navigate("/love");
  };

  return (
    <div className="join-container">
      <div className="join-title">보내는 사람 정보 입력 ✏️</div>
      <div className="join-subtext">
        완성된 메시지가 자막에 담겨 상대방에게 전달돼요.
      </div>
      <form onSubmit={handleSubmit} className="join-form">
        <input
          className="join-input"
          type="text"
          placeholder="내 이름"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
        <input
          className="join-input"
          type="text"
          placeholder="받는 사람 이름"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <input
          className="join-input"
          type="email"
          placeholder="받는 사람 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="join-buttons">
          <button className="join-button" type="submit">
            사랑 메시지 보내기
          </button>
          <button className="skip-button" type="button" onClick={handleSkip}>
            건너뛰기
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinPage;
