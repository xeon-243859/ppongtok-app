import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react'; // 추가
import { doc, getDoc } from 'firebase/firestore'; // 추가
import { db } from '../../src/firebase'; // 추가
import dynamic from 'next/dynamic';
import { QRCode } from "react-qr-code"; 

export default function ShareMessagePage() {
  const router = useRouter();
  const { id } = router.query;
  const [messageData, setMessageData] = useState(null); // 추가

  // 데이터 로딩 useEffect 추가
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchData = async () => {
      const docRef = doc(db, "messages", id);
      const docSnap = await getDoc(docRef);
      const QRCode = dynamic(() => import('qrcode.react'), { ssr: false });
      if (docSnap.exists()) {
        console.log("✅ 데이터 로딩 성공:", docSnap.data());
        setMessageData(docSnap.data());
      }
    };
    fetchData();
  }, [router.isReady, id]);

  if (!messageData) {
    return <p>데이터를 불러오는 중입니다...</p>
  }

  return (
    <>
      <Head>
        <title>공유 메시지 테스트</title>
      </Head>
      <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
        <h1>✅ 데이터 로딩 성공!</h1>
        <p>ID: <strong>{id}</strong></p>
        <pre>{JSON.stringify(messageData, null, 2)}</pre>
      </div>
    </>
  );
}
  // ...
    <div style={{ background: 'white', padding: '16px' }}>
    <QRCode value={currentUrl} size={160} />
    </div>
    // ...
  