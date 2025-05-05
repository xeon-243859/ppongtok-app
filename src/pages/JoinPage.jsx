import React, { useState } from 'react';
import './JoinPage.css';

function JoinPage() {
  const [name, setName] = useState('');
  const [receiver, setReceiver] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!name || !receiver || !email) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // 향후 저장 또는 전송 로직 삽입 가능
    alert(`고백이 완료되었습니다! 💌\n${receiver}에게 따뜻한 사랑이 전해질 거예요.`);

    // 초기화 (옵션)
    setName('');
    setReceiver('');
    setEmail('');
  };

  return (
    <div className="join-container">
      <h2>보내는 사람 정보 입력 ✍️</h2>

      <input
        type="text"
        placeholder="내 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="받는 사람 이름"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="받는 사람 이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>사랑 메시지 보내기</button>
    </div>
  );
}

export default JoinPage;
