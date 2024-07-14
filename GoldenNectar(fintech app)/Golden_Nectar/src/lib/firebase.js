import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
console.log(import.meta.env.VITE_API_KEY);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY ,
  authDomain: "golden-nectar.firebaseapp.com",
  projectId: "golden-nectar",
  storageBucket: "golden-nectar.appspot.com",
  messagingSenderId: "439767429626",
  appId: "1:439767429626:web:d4d043ad938062dbbb7443",
  measurementId: "G-WQDDPEJ8CW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()