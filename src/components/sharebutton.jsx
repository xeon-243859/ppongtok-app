// ppongtok-app/components/ShareButton.jsx

import React from 'react';

/**
 * @typedef {object} ShareContent
 * @property {object} link
 * @property {string} link.mobileWebUrl
 * @property {string} link.webUrl
 * @property {object} content
 * @property {string} content.title
 * @property {string} content.description
 * @property {string} content.imageUrl
 * @property {Array<object>} [buttons]
 */

/**
 * 카카오톡 공유 및 웹 표준 공유(Web Share API)를 지원하는 공유 버튼 컴포넌트
 * 다양한 환경에서 공유가 가능하도록 강력한 폴백 로직을 내장합니다.
 *
 * @param {{ shareContent: ShareContent, children?: React.ReactNode }} props
 */
function ShareButton({ shareContent, children }) {

  const handleShareButtonClick = async () => {
    if (!shareContent || !shareContent.link || (!shareContent.link.mobileWebUrl && !shareContent.link.webUrl) || !shareContent.content) {
      console.error('[ShareButton] 오류: shareContent가 유효하지 않거나 필수 속성이 누락되었습니다.', shareContent);
      alert('공유할 수 없는 메시지입니다. 개발자에게 문의해주세요.');
      return;
    }

    const { link, content, buttons } = shareContent;
    const shareUrl = link.webUrl || link.mobileWebUrl;

    if (!shareUrl) {
        console.error('[ShareButton] 오류: 공유될 URL이 정의되지 않았습니다.', shareContent);
        alert('공유할 URL이 없어 공유할 수 없습니다.');
        return;
    }

    console.log(`[ShareButton] 공유 시도 시작. 공유 URL: ${shareUrl}`);

    if (navigator.share) {
      console.log('[ShareButton] Web Share API 지원 확인. 시도 중...');
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: shareUrl,
        });
        console.log('[ShareButton] Web Share API 성공!');
        return;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('[ShareButton] Web Share API 취소됨: 사용자가 공유를 취소했습니다.');
        } else {
          console.error('[ShareButton] Web Share API 실패:', error.name, error.message, error);
          alert('기기 기본 공유 기능에 문제가 발생했습니다. 다른 방법으로 시도합니다.');
        }
      }
    } else {
      console.warn('[ShareButton] Web Share API를 지원하지 않는 브라우저입니다. 카카오톡 SDK로 시도.');
    }

    if (window.Kakao && window.Kakao.isInitialized()) {
      console.log('[ShareButton] Kakao SDK 초기화됨 확인. 카카오톡 공유 시도 중...');
      try {
        await new Promise((resolve, reject) => {
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: content.title,
              description: content.description,
              imageUrl: content.imageUrl,
              link: {
                mobileWebUrl: link.mobileWebUrl,
                webUrl: link.webUrl,
              },
            },
            buttons: buttons || [
              {
                title: '웹으로 보기',
                link: {
                  mobileWebUrl: link.mobileWebUrl,
                  webUrl: link.webUrl,
                },
              },
            ],
          }, {
            success: function(response) {
              console.log('[ShareButton] 카카오톡 SDK 공유 성공:', response);
              resolve(response);
            },
            fail: function(error) {
              console.error('[ShareButton] 카카오톡 SDK 공유 실패 (SDK 콜백):', error);
              reject(error);
            },
            always: function(response) {
              console.log('[ShareButton] 카카오톡 SDK 공유 시도 완료 (Always):', response);
            }
          });
        });
        console.log('[ShareButton] 카카오톡 SDK 공유 프로세스 완료.');
        return;
      } catch (error) {
        console.error('[ShareButton] 카카오톡 SDK 공유 실패 (Promise catch):', error);
        alert('카카오톡 공유 기능에 문제가 발생했습니다. 다음 방법으로 시도합니다.');
      }
    } else {
      console.warn('[ShareButton] Kakao SDK가 초기화되지 않았거나 로드되지 않았습니다. 클립보드 복사로 시도.');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      console.log('[ShareButton] 클립보드 복사 기능 지원 확인. URL 복사 시도 중...');
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('공유 링크가 클립보드에 복사되었습니다! 카카오톡에서 친구에게 직접 붙여넣기 해주세요.');
        console.log('[ShareButton] 클립보드에 URL 복사 성공.');
      } catch (err) {
        console.error('[ShareButton] 클립보드 복사 실패:', err);
        alert('링크 복사에 실패했습니다. 다음 URL을 수동으로 복사하여 공유해주세요:\n' + shareUrl);
      }
    } else {
      console.warn('[ShareButton] 클립보드 복사 API 미지원. 수동 복사 프롬프트 표시.');
      window.prompt("링크를 복사하여 공유해주세요:", shareUrl);
    }
  };

  return (
    <button
      onClick={handleShareButtonClick}
      style={{
        padding: '12px 25px',
        fontSize: '18px',
        backgroundColor: '#FFEB00',
        color: '#3C1E1E',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap'
      }}
      title="이 메시지를 카카오톡 또는 다른 앱으로 공유합니다."
    >
      <img src="/icons/kakaotalk-icon.png" alt="카카오톡" style={{ width: '24px', height: '24px' }} />
      {children || '카카오톡으로 공유하기'}
    </button>
  );
}

export default ShareButton;