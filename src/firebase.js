import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDY5t1cmaj6g7ywiFckcNwtlSAnV3cD3cU",
  authDomain: "zenshelf-tracker-9f2b3.firebaseapp.com",
  projectId: "zenshelf-tracker-9f2b3",
  storageBucket: "zenshelf-tracker-9f2b3.firebasestorage.app",
  messagingSenderId: "299522607607",
  appId: "1:299522607607:web:03dbd55076d85ad97f46f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
