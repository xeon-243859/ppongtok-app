// 파일 경로: /api/view/[id].js

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AlzaSyA5aUBf0PDRHeVZXx3jMFx8uwGTYVVMqk4",
  authDomain: "ppongtok-project.firebaseapp.com",
  projectId: "ppongtok-project",
  storageBucket: "ppongtok-project.appspot.com",
  messagingSenderId: "183327414536",
  appId: "1:183327414536:web:f2442c9799b3ba150ef4bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const docRef = doc(db, "sharedMessages", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).send("메시지를 찾을 수 없습니다.");
    }

    const { imageUrl, caption } = docSnap.data();

    const html = `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta property="og:title" content="뿅!톡에서 메시지가 도착했어요 💌" />
          <meta property="og:description" content="${caption}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="https://ppongtok-app.vercel.app/view/${id}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta charset="UTF-8" />
          <title>뿅!톡 메시지 보기</title>
        </head>
        <body>
          <script>
            window.location.href = "/view/${id}";
          </script>
        </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("❌ SSR 공유 페이지 로드 오류:", error);
    res.status(500).send("서버 오류");
  }
}
