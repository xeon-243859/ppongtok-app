// pages/api/view/[id].js

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";  // ← ⚠️ 이 경로는 프로젝트에 맞게 조정하세요

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const ref = doc(db, "messages", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return res.status(404).send("Message not found");
    }

    const data = snap.data();
    const title = "뿅!톡 – 감성 메시지 도착!";
    const description = data.caption || "당신을 위한 감성 메시지를 확인해보세요!";
    const image =
      data.imageUrls?.[0] ||
      data.videoUrl ||
      "https://your-default-image.png"; // 기본 썸네일 URL (없을 경우 대비)

    const redirectUrl = `https://ppongtok-app.vercel.app/view/${id}`;

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:url" content="${redirectUrl}" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
        </head>
        <body>
          <p>공유된 메시지로 이동 중입니다...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("OG 렌더링 실패:", error);
    res.status(500).send("Internal Server Error");
  }
}
