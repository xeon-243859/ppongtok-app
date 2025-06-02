const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.ogMeta = functions.https.onRequest(async (req, res) => {
  const id = req.path.split("/").pop();
  if (!id) return res.status(400).send("No ID provided");

  try {
    const docRef = db.collection("messages").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).send("Message not found");
    }

    const data = docSnap.data();

    const image = data.imageUrl || "https://via.placeholder.com/600x400.png?text=PPONGTOK";
    const caption = data.caption || "누군가 당신에게 마음을 보냈어요";

    const html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>뿅!톡 메시지</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="💌 뿅!톡 감성 메시지가 도착했어요" />
        <meta property="og:description" content="${caption}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://ppongtok-app.vercel.app/view/${id}" />

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="💌 뿅!톡 감성 메시지가 도착했어요" />
        <meta name="twitter:description" content="${caption}" />
        <meta name="twitter:image" content="${image}" />
      </head>
      <body>
        <p>메타태그가 설정되었습니다. 이 페이지는 카카오톡 미리보기를 위한 용도입니다.</p>
      </body>
      </html>
    `;

    res.status(200).send(html);
  } catch (error) {
    console.error("🔥 Open Graph 생성 실패:", error);
    res.status(500).send("Internal Server Error");
  }
});
