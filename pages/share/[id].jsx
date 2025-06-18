import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ShareMessagePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) {
    return <p>ID를 확인하는 중입니다...</p>;
  }

  return (
    <>
      <Head>
        <title>공유 메시지 테스트</title>
      </Head>
      <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>✅ 페이지 로딩 성공!</h1>
        <p style={{ fontSize: '20px' }}>전달받은 ID는: <strong>{id}</strong> 입니다.</p>
        <p>이 화면이 보인다면, 다음 단계로 넘어갈 수 있습니다.</p>
      </div>
    </>
  );
}