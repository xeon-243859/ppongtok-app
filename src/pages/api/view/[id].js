import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const docRef = db.collection("messages").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).send("Message not found");
      return;
    }

    const data = doc.data();
    const { caption = "감동적인 영상 메시지를 확인해보세요.", imageUrls, videoUrl } = data;

    const ogTitle = "누군가 당신에게 메시지를 보냈어요!";
    const ogDescription = caption;
    const ogImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;
    const ogVideo = videoUrl || null;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ""}
        ${ogVideo ? `<meta property="og:video" content="${ogVideo}" />` : ""}
        <meta property="og:url" content="https://ppongtok-app.vercel.app/view/${id}" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>
        <script>
          window.location.href = "https://ppongtok-app.vercel.app/view/${id}";
        </script>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("Error generating OG meta:", error);
    res.status(500).send("Server error");
  }
}
