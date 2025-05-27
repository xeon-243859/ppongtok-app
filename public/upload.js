import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// ✅ 수정된 firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyA5aUBf0PDRHeVZYx3jMFx8uwGTYVVMqk4",
  authDomain: "ppongtok-project.firebaseapp.com",
  projectId: "ppongtok-project",
  storageBucket: "ppongtok-project.firebasestorage.app",
  messagingSenderId: "183327414536",
  appId: "1:183327414536:web:f2442c9799b3ba150ef4bd",
  measurementId: "G-XSKQ8EB0VB"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// 🔽 업로드 로직
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");

uploadBtn.addEventListener("click", async () => {
  if (!fileInput.files.length) {
    alert("파일을 먼저 선택해주세요!");
    return;
  }

  const file = fileInput.files[0];
  const fileRef = ref(storage, `thumbnails/${Date.now()}-${file.name}`);

  try {
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("✅ 다운로드 URL:", downloadURL);
    result.innerText = downloadURL;
    alert("URL 복사해서 share.html에 붙여넣어줘!");
  } catch (err) {
    console.error("❌ 업로드 에러:", err);
    result.innerText = "업로드 실패";
  }
});
