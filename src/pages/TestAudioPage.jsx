import React from "react";

const TestAudioPage = () => {
  const playAudio = () => {
    const audio = document.getElementById("test-audio");
    if (audio) {
      audio.play().catch(e => {
        console.warn("재생 실패:", e);
        alert("브라우저가 자동 재생을 차단했어요. 버튼을 다시 눌러주세요.");
      });
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f4f4f4"
    }}>
      <h1>🎵 배경 음악 단독 테스트</h1>
      <p>아래 버튼을 누르면 음악이 재생되어야 해요.</p>
      <audio id="test-audio">
        <source src="/music/mueon1.mp3" type="audio/mpeg" />
        브라우저가 오디오를 지원하지 않습니다.
      </audio>
      <button
        onClick={playAudio}
        style={{
          padding: "12px 24px",
          fontSize: "1rem",
          marginTop: "20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#ff7f7f",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        ▶ 음악 재생하기
      </button>
    </div>
  );
};

export default TestAudioPage;
