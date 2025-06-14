const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");


admin.initializeApp(); // ✅ 이 줄 추가!

const db = admin.firestore();
const storage = new Storage();

// ✅ OG 태그 렌더링용 Functions (공유 시 미리보기 대응)
exports.ogMeta = functions.https.onRequest(async (req, res) => {
  const id = req.path.replace("/", "");
  if (!id) {
    return res.status(400).send("No ID provided");
  }

  try {
    const docRef = db.collection("messages").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).send("Message not found");
    }

    const data = docSnap.data();
    const image =
      data.thumbnailUrl ||
      (data.imageUrls && data.imageUrls[0]) ||
      data.videoUrl ||
      "https://via.placeholder.com/600x400.png?text=PPONGTOK";

    const title = data.caption || "감정을 담은 뿅!톡 메시지";
    const description = "내 마음을 전하는 감성 메시지 카드";

    res.set("Content-Type", "text/html");
    res.status(200).send(`<!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="https://ppongtok-app.vercel.app/view/${id}" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>뿅!톡 미리보기</title>
      </head>
      <body>
        <p>이 페이지는 카카오톡 미리보기를 위한 og 메타태그 제공용입니다.</p>
      </body>
      </html>`);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).send("Server error");
  }
});



  Object.assign(exports, require("./captureScreenshot"));

