// src/pages/view/[id].js
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// 🔐 Firebase 구성 - 필요한 값으로 교체

 
  const firebaseConfig = {
  apiKey: "AIzaSyA5aUBf0PDRHeVZYx3jMFx8uwGTYVVMqk4",
  authDomain: "ppongtok-project.firebaseapp.com",
  projectId: "ppongtok-project",
  storageBucket: "ppongtok-project.firebasestorage.app",
  messagingSenderId: "183327414536",
  appId: "1:183327414536:web:f2442c9799b3ba150ef4bd"
};

 

export async function getServerSideProps(context) {
  const { id } = context.params;

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const docRef = doc(db, "messages", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: docSnap.data(),
    },
  };
}

export default function ViewMessagePage({ data }) {
  const { caption, imageUrls = [], videoUrl } = data;

 return (
  <div style={{ padding: 20 }}>
    <h1>💌 공유된 메시지</h1>

    {/* 🎥 영상 렌더링 */}
    {data.videoUrl && (
      <video controls style={{ width: "100%", marginTop: 16 }}>
        <source src={data.videoUrl} type="video/mp4" />
      </video>
    )}

    {/* 🖼 이미지 렌더링 */}
    {data.imageUrls?.length > 0 &&
      data.imageUrls.map((url, index) => (
        <div key={index}>
          <img
            src={url}
            alt={`공유 이미지 ${index + 1}`}
            style={{ maxWidth: "100%", marginBottom: 16 }}
          />
        </div>
      ))}

    {/* 💌 자막 렌더링 */}
    <p style={{ background: "#fee", padding: "1rem", fontSize: "1.2rem" }}>
      {data.caption}
    </p>

    {/* 🎵 음악 자동 재생 */}
    {data.music && (
      <audio src={data.music} autoPlay loop />
    )}
  </div>
);
}
console.log("테스트");