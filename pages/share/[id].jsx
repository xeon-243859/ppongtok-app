// pages/share/view/[id].jsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../src/firebase';
import styles from '../../../src/styles/viewpreview.module.css';
import { useAuth } from '../../../src/contexts/AuthContext';

export const dynamic = 'force-dynamic';

export default function ViewMessagePreviewPage() {
  const router = useRouter();
  // ✨ [수정] 쿼리 파라미터에서 continue_share를 읽어옵니다. 로그인/결제 후 자동 공유를 위한 신호입니다.
  const { id, continue_share } = router.query;
  const { user, dbUser, loading } = useAuth();

  const [previewData, setPreviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✨ [수정] 페이지 로드 시 자동으로 공유를 재시도하는 로직
  useEffect(() => {
    // 1. URL에 'continue_share=true' 신호가 있고,
    // 2. 사용자 정보 로딩이 끝났으며 (중요!),
    // 3. 사용자가 로그인 되어 있는지 확인합니다.
    if (continue_share === 'true' && !loading && user && dbUser) {
      console.log('🚀 로그인/결제 후 자동 공유를 시작합니다.');
      
      const savedData = localStorage.getItem('previewData');
      if (savedData) {
        // 이전에 저장해 둔 미리보기 데이터를 가지고 handleShare를 바로 실행합니다.
        handleShare(JSON.parse(savedData));
      } else {
        alert('자동 공유에 필요한 데이터를 찾을 수 없습니다. 다시 시도해주세요.');
      }
    }
  }, [continue_share, loading, user, dbUser, router]); // 의존성 배열에 필요한 모든 값 추가

  // 페이지에 처음 진입하여 미리보기 데이터를 생성하는 로직
  useEffect(() => {
    if (!router.isReady) return;

    // 'preview' 경로로 들어왔을 때만 localStorage의 데이터를 조합해 미리보기를 만듭니다.
    if (id === 'preview') {
      const type = localStorage.getItem('selected-type');
      const message = localStorage.getItem('message');
      if (!type) {
        alert('필수 정보가 없어 메시지를 생성할 수 없습니다. 처음부터 다시 시도해주세요.');
        router.push('/');
        return;
      }

      const data = {
        type,
        message: message || '',
        music: localStorage.getItem('selected_music_src'),
        imageUrls: [],
        videoUrl: null,
        createdAt: new Date(),
      };

      if (type === 'image') {
        const images = [];
        for (let i = 0; i < 4; i++) {
          const img = localStorage.getItem(`ppong_image_${i}`);
          if (img) images.push(img);
        }
        data.imageUrls = images;
      } else if (type === 'video') {
        data.videoUrl = localStorage.getItem('selected-video');
      }

      setPreviewData(data);
      // 🔥 미리보기 데이터를 localStorage에 저장하여 자동 공유 시 재사용합니다.
      localStorage.setItem('previewData', JSON.stringify(data));
    }
  }, [router.isReady, id]);

  // 이미지 슬라이드 효과를 위한 로직
  useEffect(() => {
    if (previewData?.type === 'image' && previewData.imageUrls?.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % previewData.imageUrls.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [previewData]);

  // [수정] handleShare 함수가 미리보기 데이터를 인자로 받을 수 있도록 변경
  const handleShare = async (dataFromAutoFlow = null) => {
    // 자동 공유 시에는 인자로 받은 데이터를, 직접 클릭 시에는 state 데이터를 사용합니다.
    const finalData = dataFromAutoFlow || previewData;
    setIsProcessing(true);

    if (!finalData) {
      alert('공유할 데이터가 없습니다. 처음부터 다시 시도해주세요.');
      setIsProcessing(false);
      return;
    }

    // [1단계: 로그인 검사]
    if (!user || !dbUser) {
      alert('메시지를 저장하고 공유하려면 로그인이 필요해요!');
      // ✨ [수정] 로그인 후 돌아올 때 '자동 공유'를 실행하라는 신호를 쿼리 파라미터로 추가합니다.
      router.push(`/loginpage?redirect=${router.asPath}&auto_share=true`);
      setIsProcessing(false);
      return;
    }
    
    // [2단계: 이용권 검사]
    const hasTickets = dbUser.freePassRemaining > 0;
    if (!hasTickets) {
      alert('이용권이 모두 소진되었어요. 이용권을 먼저 구매해주세요!');
      // ✨ [수정] 결제 후 돌아올 때도 '자동 공유' 신호를 추가합니다.
      router.push(`/paymentpage?redirect=${router.asPath}&auto_share=true`);
      setIsProcessing(false);
      return;
    }

    // [3단계: 모든 검사 통과, 메시지 생성 및 공유]
    try {
      console.log('🛠️ 공유 로직 실행 중...');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        freePassRemaining: dbUser.freePassRemaining - 1,
      });

      const dataToSave = {
        ...finalData,
        authorUid: user.uid,
        authorName: user.displayName || '이름없음',
      };
      const newId = `msg_${Date.now()}`;

      if (dataToSave.type === 'image' && dataToSave.imageUrls.length > 0) {
        const downloadUrls = await Promise.all(
          dataToSave.imageUrls.map(async (base64, index) => {
            const imageRef = ref(storage, `messages/${newId}/image_${index}.jpg`);
            await uploadString(imageRef, base64, 'data_url');
            return getDownloadURL(imageRef);
          })
        );
        dataToSave.imageUrls = downloadUrls.filter(Boolean);
      }
      
      const messageDocRef = doc(db, 'messages', newId);
      await setDoc(messageDocRef, dataToSave);
      
      console.log('✅ 최종 공유 페이지로 이동합니다:', `/share/${newId}`);

      // ✨ 자동 공유 작업이 끝났으므로, 관련 localStorage 데이터를 정리합니다.
      localStorage.removeItem('previewData');
      
      // `replace`를 사용해 브라우저 히스토리에 현재 페이지를 남기지 않고 이동합니다.
      // (사용자가 뒤로가기를 눌렀을 때 이 미리보기 페이지로 다시 오지 않도록 하기 위함)
      router.replace(`/share/${newId}`);

    } catch (error) {
      console.error('🔥 최종 저장/공유 단계 오류:', error);
      alert('메시지를 저장하는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!previewData && id === "preview") {
    return <p className={styles.loadingText}>미리보기를 생성 중입니다...</p>;
  }

  return (
    <>
      <Head>
        <title>메시지 미리보기</title>
      </Head>
      <div className={styles['preview-container']}>
        <h2 className={styles['preview-title']}>✨ 생성된 메시지 미리보기</h2>

        <div className={styles['moving-box']}>
          {previewData?.type === 'video' && previewData.videoUrl && (
            <video src={previewData.videoUrl} controls autoPlay loop muted className={styles['media-element']} />
          )}
          {previewData?.type === 'image' && previewData.imageUrls.length > 0 && (
            <img
              key={currentImageIndex}
              src={previewData.imageUrls[currentImageIndex]}
              alt={`slide-${currentImageIndex}`}
              className={styles.slideImage}
            />
          )}
          {previewData?.message && (
            <div className={styles['caption-scroll-container']}>
              <div className={styles['caption-scroll']}>{previewData.message}</div>
            </div>
          )}
        </div>

        {previewData?.music && (
          <audio src={previewData.music} controls autoPlay style={{ width: '90%', maxWidth: '500px', marginTop: '15px' }} />
        )}

        <div className={styles['preview-button-group']}>
          <button className={styles['preview-button']} onClick={() => router.back()}>
            뒤로가기
          </button>
          <button
            className={`${styles['preview-button']} ${styles.highlight}`}
            onClick={() => handleShare(null)} // 사용자가 직접 클릭 시에는 null을 넘겨 state 데이터를 사용하게 함
            disabled={isProcessing || !previewData || loading}
          >
            {isProcessing ? '처리 중...' : '공유하기'}
          </button>
        </div>
      </div>
    </>
  );
}