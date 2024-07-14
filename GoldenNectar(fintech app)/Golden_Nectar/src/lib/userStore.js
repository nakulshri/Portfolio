import { create } from 'zustand';
import { db } from './firebase';
import { doc, getDoc, updateDoc, collection } from 'firebase/firestore';

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      console.log("No UID provided. Setting currentUser to null.");
      return set({ currentUser: null, isLoading: false });
    }

    console.log(`Fetching user info for UID: ${uid}`);
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.log("No such document!");
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching document:", err);
      set({ currentUser: null, isLoading: false });
    }
  },
}));