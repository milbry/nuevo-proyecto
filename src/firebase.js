import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCkDw96Q7AqVjMNvaA4v0n3y3-mNCZarOg",
  authDomain: "proyecto-4c912.firebaseapp.com",
  projectId: "proyecto-4c912",
  storageBucket: "proyecto-4c912.firebasestorage.app",
  messagingSenderId: "756364152022",
  appId: "1:756364152022:web:fad35a02b8a327be774d77"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);