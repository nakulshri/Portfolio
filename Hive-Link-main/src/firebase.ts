import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ✅ Define Firebase configuration with correct types
const firebaseConfig = {
  apiKey: "AIzaSyA1vizbOR7EkCoAbXALjXo2HvQE8kf0cY0",
  authDomain: "hivelink-470ec.firebaseapp.com",
  projectId: "hivelink-470ec",
  storageBucket: "hivelink-470ec.appspot.com", // 🔥 Fix incorrect storage URL
  messagingSenderId: "668030915811",
  appId: "1:668030915811:web:a3aa62aff8b92718b7e1d6",
  measurementId: "G-8Q46ZZBGDD"
};

// ✅ Initialize Firebase properly
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ✅ Export the initialized Firestore database
export { db, analytics, app };
