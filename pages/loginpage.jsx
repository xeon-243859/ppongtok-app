// pages/loginpage.jsx

import { useAuth } from '../src/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../src/firebase';

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const router = useRouter();
  // ✨ [수정] URL 쿼리에서 돌아갈 주소(redirect)와 자동 공유 신호(auto_share)를 읽습니다.
  const { redirect, auto_share } = router.query;

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('❌ 로그인 요청 실패:', err);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const checkAndSaveUser = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || '이름 없음',
            photoURL: currentUser.photoURL || '',
            createdAt: new Date(),
            freePassRemaining: 3, // 신규 유저에게 무료 이용권 3장 지급
          });
          alert('회원가입을 축하합니다! 무료 이용권 3장이 지급되었어요.');
        }

        // ✨ [수정] 로그인 후 돌아갈 주소를 처리하는 로직
        if (redirect) {
          // 'auto_share' 신호가 있으면, 돌아갈 주소에 'continue_share=true'를 붙여줍니다.
          const destination = auto_share === 'true' ? `${redirect}?continue_share=true` : redirect;
          console.log('로그인 성공. 목적지로 이동합니다:', destination);
          router.push(destination);
        } else {
          router.push('/'); // 돌아갈 곳이 지정되지 않았으면 홈으로 이동
        }
      }
    };

    checkAndSaveUser();
  }, [currentUser, router, redirect, auto_share]); // 의존성 배열에 쿼리 값들 추가

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>로그인하고 시작하세요</h2>
      <p>메시지를 만들고 공유하려면 로그인이 필요해요.</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        구글 계정으로 로그인
      </button>
    </div>
  );
}
// ✨ [수정] URL 쿼리에서 돌아갈 주소(redirect)와 자동 공유 신호(auto_share)를 읽습니다.