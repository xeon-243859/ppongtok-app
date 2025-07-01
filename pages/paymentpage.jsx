// pages/paymentpage.jsx

import { useRouter } from 'next/router';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../src/contexts/AuthContext';

export default function PaymentPage() {
  const router = useRouter();
  const { currentUser, dbUser } = useAuth();
  const db = getFirestore();
  // ✨ [수정] URL 쿼리에서 돌아갈 주소(redirect)와 자동 공유 신호(auto_share)를 읽습니다.
  const { redirect, auto_share } = router.query;

  const handlePurchase = async (passCount, bonus = 0) => {
    if (!currentUser || !dbUser) {
      alert('로그인 후 이용권을 구매할 수 있습니다!');
      router.push(`/loginpage?redirect=${router.asPath}`); // 결제 페이지에서도 로그인 후 돌아오도록 설정
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const currentPass = dbUser.freePassRemaining || 0;

    await updateDoc(userRef, {
      freePassRemaining: currentPass + passCount + bonus,
    });
    
    alert(`이용권이 ${passCount + bonus}장 충전되었습니다. 공유를 계속 진행합니다.`);

    // ✨ [수정] 결제 성공 후, 자동 공유 흐름을 계속하기 위해 리다이렉트합니다.
    if (redirect && auto_share === 'true') {
      const destination = `${redirect}?continue_share=true`;
      console.log('결제 성공. 자동 공유를 위해 목적지로 이동합니다:', destination);
      router.push(destination);
    } else if (redirect) {
      router.push(redirect); // 자동 공유가 아니더라도, 원래 있던 곳으로 돌아갑니다.
    } else {
      router.push('/'); // 만약을 위한 기본 경로
    }
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>이용권 구매</h2>
      <p>원하는 이용권 패키지를 선택해주세요.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => handlePurchase(1)} style={{ padding: '10px 20px', width: '250px' }}>
          1회 이용권 - 1,000원
        </button>
        <button onClick={() => handlePurchase(5, 1)} style={{ padding: '10px 20px', width: '250px' }}>
          5회 이용권 + 1장 무료 - 5,000원
        </button>
        <button onClick={() => handlePurchase(10, 3)} style={{ padding: '10px 20px', width: '250px' }}>
          10회 이용권 + 3장 무료 - 10,000원
        </button>
      </div>
    </div>
  );
}