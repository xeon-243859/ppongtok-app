import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/messages/${id}`);
        setMessageData(res.data);
      } catch (err) {
        console.error('메시지 데이터를 불러오는 중 오류:', err);
      }
    };
    fetchData();
  }, [id]);

  if (!messageData) return <p>로딩 중...</p>;

  const handleKakaoShare = () => {
    if (!window.Kakao) return;
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '누군가 당신에게 메시지를 보냈어요!',
        description: messageData.caption,
        imageUrl: messageData.imageUrl || '기본이미지URL',
        link: {
          webUrl: `${window.location.origin}/view/${id}`,
          mobileWebUrl: `${window.location.origin}/view/${id}`,
        },
      },
      buttons: [
        {
          title: '메시지 보러가기',
          link: {
            webUrl: `${window.location.origin}/view/${id}`,
            mobileWebUrl: `${window.location.origin}/view/${id}`,
          },
        },
      ],
    });
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>공유할 준비가 끝났어요!</h2>
      <button onClick={handleKakaoShare} style={{ fontSize: '1.2rem', padding: '0.6rem 1.4rem' }}>
        카카오톡으로 공유하기
      </button>
    </div>
  );
}
