import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    if (!id) return;

    // ✅ 임시 더미 데이터 삽입 (Firebase 아직 안 쓰는 상태니까)
    setMessageData({
      caption: "이건 테스트 메시지입니다.",
      imageUrl: "https://via.placeholder.com/600x400?text=테스트+이미지", // ✅ 외부 URL
    });
  }, [id]);

  if (!messageData) return <p>로딩 중...</p>;

  const handleKakaoShare = () => {
    if (!window.Kakao) return;
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '누군가 당신에게 메시지를 보냈어요!',
        description: messageData.caption,
        imageUrl: messageData.imageUrl || "https://via.placeholder.com/600x400?text=테스트+이미지",
        link: {
          mobileWebUrl: `${window.location.origin}/view/${id}`,
          webUrl: `${window.location.origin}/view/${id}`,
        },
      },
      buttons: [
        {
          title: '메시지 보러가기',
          link: {
             mobileWebUrl: `${window.location.origin}/view/${id}`,
             webUrl: `${window.location.origin}/view/${id}`,
          },
        },
      ],
    });
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>공유 테스트 페이지</h2>
      <p>{messageData.caption}</p>
      <img
        src={messageData.imageUrl}
        alt="미리보기 이미지"
        style={{ maxWidth: '100%', borderRadius: '16px', margin: '20px 0' }}
      />
      <button
        onClick={handleKakaoShare}
        style={{
          fontSize: '1.2rem',
          padding: '0.6rem 1.4rem',
          backgroundColor: '#FEE500',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        카카오톡으로 공유하기
      </button>
    </div>
  );
}
