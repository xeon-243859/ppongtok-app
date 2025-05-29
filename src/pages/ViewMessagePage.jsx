// ViewMessagePage.jsx (최종본)
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const ViewMessagePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageData, setMessageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const messageId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const fetchMessage = async () => {
      if (!messageId) return;
      try {
        const docRef = doc(db, 'messages', messageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
        } else {
          alert('메시지를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [messageId]);

  const handleShare = () => {
    navigate(`/share?id=${messageId}`);
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className="view-container">
      <h2>미리보기</h2>
      {messageData?.videoUrl ? (
        <video src={messageData.videoUrl} controls />
      ) : (
        messageData?.imageUrls?.map((url, idx) => (
          <img key={idx} src={url} alt="preview" style={{ maxWidth: '100%' }} />
        ))
      )}
      <p>{messageData?.caption}</p>
      {messageData?.musicUrl && (
        <audio controls src={messageData.musicUrl} />
      )}
      <button onClick={handleShare}>공유하기</button>
    </div>
  );
};

export default ViewMessagePage;


// MusicSelectPage.jsx 내 handleNext 함수 (추가/수정)

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const handleNext = async () => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      imageUrls: selectedImages,
      videoUrl: selectedVideo,
      musicUrl: selectedMusic,
      caption: caption,
      createdAt: new Date(),
    });
    navigate(`/view-message?id=${docRef.id}`);
  } catch (error) {
    console.error('저장 실패:', error);
    alert('메시지 저장에 실패했습니다.');
  }
};


