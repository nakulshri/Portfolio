// firebaseFunctions.js
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export const addTransaction = async (userId, transaction) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "transactions"), transaction);
    return docRef.id;
  } catch (e) {
    console.error("Error adding transaction: ", e);
  }
};

export const getTransactions = async (userId) => {
  const transactions = [];
  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "transactions"));
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error("Error getting transactions: ", e);
  }
  return transactions;
};

export const updateTransaction = async (userId, transactionId, updatedTransaction) => {
  try {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(transactionRef, updatedTransaction);
  } catch (e) {
    console.error("Error updating transaction: ", e);
  }
};

export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await deleteDoc(transactionRef);
  } catch (e) {
    console.error("Error deleting transaction: ", e);
  }
};
