import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "firefly-4ce47.firebaseapp.com",
  projectId: "firefly-4ce47",
  storageBucket: "firefly-4ce47.appspot.com",
  messagingSenderId: "123418622137",
  appId: "1:123418622137:web:be8fb6ead90b248b598368",
  measurementId: "G-S80B07QEDJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()