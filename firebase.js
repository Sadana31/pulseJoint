// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV-8jJAYj_uOaBnjeGrKmFfnbE6gfDCrM",
  authDomain: "pulsejoint.firebaseapp.com",
  projectId: "pulsejoint",
  storageBucket: "pulsejoint.firebasestorage.app",
  messagingSenderId: "860930854990",
  appId: "1:860930854990:web:7f5319141be342c7f4b31f",
  measurementId: "G-49LT0X2FN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
export const db = getFirestore(app);
