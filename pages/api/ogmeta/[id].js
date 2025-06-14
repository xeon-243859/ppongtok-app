// pages/api/ogmeta/[id].js
import { db } from "../../../src/firebase";

export default async function handler(req, res) {
  const { id } = req.query;
  const snapshot = await db.collection("messages").doc(id).get();

  if (!snapshot.exists) {
    return res.status(404).send("Message not found");
  }

  const data = snapshot.data();
  const imageUrl = data?.thumbnailUrl || "https://via.placeholder.com/600x400";

  const html = `
    <html>
      <head>
        <meta property="og:title" content="뿅!톡 메시지" />
        <meta property="og:description" content="${data?.caption || "누군가 보낸 메시지를 확인하세요!"}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="https://ppongtok-app.vercel.app/share/${id}" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <p>카카오톡 공유 미리보기 설정 페이지입니다.</p>
      </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
