import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5aUBf0PDRHeVZYx3jMFx8uwGTYVVMqk4",
  authDomain: "ppongtok-project.firebaseapp.com",
  projectId: "ppongtok-project",
  storageBucket: "ppongtok-project.appspot.com",
  messagingSenderId: "183327414536",
  appId: "1:183327414536:web:f2442c9799b3ba150ef4bd"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
export { app };
