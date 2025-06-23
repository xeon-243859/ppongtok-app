// ppongtok-app/pages/share/[id].jsx (에러 수정 및 기능 개선 완료)

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script'; // [수정] Next.js의 Script 컴포넌트 사용
import QRCode from 'qrcode.react';
import styles from '../../src/styles/sharepage.module.css';

export default function SharePage() {
    const router = useRouter();
    const { id } = router.query;
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [pageUrl, setPageUrl] = useState('');

    const ogData = {
        title: "특별한 메시지가 도착했어요!",
        description: "친구에게 온 마음을 확인해보세요.",
        imageUrl: "https://ppongtok-app.vercel.app/default-og-image.png"
    };

    useEffect(() => {
        if (id) {
            const currentUrl = `${window.location.protocol}//${window.location.host}/present/${id}`;
            setPageUrl(currentUrl);
        }
    }, [id]);
    
    // [수정] 카카오 SDK 로드 완료 시 실행될 함수
    const handleKakaoSdkLoad = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '여기에_카카오_자바스크립트_키를_입력하세요';
            window.Kakao.init(KAKAO_KEY);
            setSdkLoaded(true);
        } else if (window.Kakao && window.Kakao.isInitialized()) {
            setSdkLoaded(true);
        }
    };
    
    // (핸들러 함수들은 그대로 유지)
    const handleKakaoShare = () => { if (!sdkLoaded || !pageUrl) return; window.Kakao.Share.sendDefault({ objectType: 'feed', content: { title: ogData.title, description: ogData.description, imageUrl: ogData.imageUrl, link: { mobileWebUrl: pageUrl, webUrl: pageUrl }, }, buttons: [{ title: '메시지 확인하기', link: { mobileWebUrl: pageUrl, webUrl: pageUrl } }], }); };
    const handleWebShare = async () => { if (navigator.share && pageUrl) { try { await navigator.share({ title: ogData.title, text: ogData.description, url: pageUrl }); } catch (error) { console.error('Web Share API 오류:', error); } } else { handleLinkCopy(); } };
    const handleLinkCopy = () => { if (!pageUrl) return; navigator.clipboard.writeText(pageUrl).then(() => alert("링크가 복사되었습니다!")).catch(err => alert("링크 복사에 실패했습니다.")); };
    const shareTo = (platform) => { if (!pageUrl) return; let url = ''; const encodedUrl = encodeURIComponent(pageUrl); const encodedTitle = encodeURIComponent(ogData.title); switch (platform) { case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break; case 'twitter': url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`; break; default: return; } window.open(url, '_blank', 'width=600,height=400'); };

    return (
        <>
            <Head>
                <title>메시지 공유하기</title>
                <meta property="og:title" content={ogData.title} />
                <meta property="og:description" content={ogData.description} />
                <meta property="og:image" content={ogData.imageUrl} />
                {pageUrl && <meta property="og:url" content={pageUrl} />}
                <meta property="og:type" content="website" />
            </Head>

            {/* [수정] Next.js의 Script 컴포넌트로 SDK 로드, integrity 제거 */}
            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
                strategy="lazyOnload"
                onLoad={handleKakaoSdkLoad}
            />

            <div className={styles.shareContainer}>
                <div className={styles.shareBox}>
                    <h1 className={styles.title}>마음을 전해 보세요</h1>
                    <div className={styles.qrCodeWrapper}>
                        {pageUrl ? <QRCode value={pageUrl} size={128} bgColor="#ffffff" fgColor="#000000" level="L" includeMargin={false} /> : <div className={styles.qrPlaceholder}></div>}
                    </div>
                    <p className={styles.subtitle}>화면의 QR 코드를 스캔하거나<br/>아래 버튼으로 공유해 보세요.</p>
                    <div className={styles.shareGrid}>
                        <ShareButton icon="kakao" text="카카오톡" onClick={handleKakaoShare} disabled={!sdkLoaded} />
                        <ShareButton icon="contacts" text="내 연락처" onClick={handleWebShare} />
                        <ShareButton icon="link" text="링크 복사" onClick={handleLinkCopy} />
                        <ShareButton icon="facebook" text="페이스북" onClick={() => shareTo('facebook')} />
                        <ShareButton icon="twitter" text="트위터" onClick={() => shareTo('twitter')} />
                    </div>
                    <button onClick={() => router.push('/')} className={styles.homeButton}>처음으로 돌아가기</button>
                </div>
            </div>
        </>
    );
}

function ShareButton({ icon, text, onClick, disabled = false }) {
    return (
        <button onClick={onClick} className={styles.shareButton} disabled={disabled}>
            <div className={`${styles.iconWrapper} ${styles[icon]}`}><span className={styles.icon}></span></div>
            <span className={styles.buttonText}>{text}</span>
        </button>
    );
}