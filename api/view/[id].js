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

  const docRef = doc(db, "sharedMessages", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return res.status(404).send("Not Found");
  }

  const { imageUrl, caption } = docSnap.data();

  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>감동 메시지 도착 💌</title>
      <meta property="og:title" content="감동 메시지 도착 💌" />
      <meta property="og:description" content="${caption}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="https://ppongtok-app.vercel.app/view/${id}" />
      <meta name="twitter:card" content="summary_large_image" />
    </head>
    <body>
      <p>공유 메시지를 불러오는 중입니다...</p>
      <script>location.href = "/view/${id}";</script>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
