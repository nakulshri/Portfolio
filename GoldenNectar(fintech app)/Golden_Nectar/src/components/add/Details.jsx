import React, { useState, useEffect } from 'react';
import './ExpenseIncomeDetailsPage.css';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../lib/userStore';

const ExpenseIncomeDetailsPage = () => {
  const { currentUser, isLoading } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (userId) => {
    try {
      const docRef = doc(db, "userTransaction", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data || { income: [], expense: [] }; // Ensure data has default values
      } else {
        console.log("No such document!");
        return { income: [], expense: [] }; // Return empty arrays if document doesn't exist
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return { income: [], expense: [] }; // Return empty arrays on error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = currentUser.id; // Replace with currentUser.uid
        const transactions = await fetchTransactions(userId);
        console.log("Fetched transactions:", transactions);

        const incomeTransactions = transactions.income || [];
        const expenseTransactions = transactions.expense || [];
  
        const allTransactions = [
          ...incomeTransactions.map(transaction => ({ ...transaction, type: 'income' })),
          ...expenseTransactions.map(transaction => ({ ...transaction, type: 'expense' }))
        ];
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching or calculating totals:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (!isLoading && currentUser) {
      fetchData();
    }
  }, [currentUser, isLoading]);

  const deleteTransaction = async (transactionId) => {
    console.log('Deleting transaction:', transactionId);

    try {
      const docRef = doc(db, 'userTransaction', currentUser.id); // Assuming currentUser.id is the userId
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedExpense = data.expense.filter(transaction => transaction.id !== transactionId);

        // Update Firestore document with the modified expense array
        await updateDoc(docRef, {
          expense: updatedExpense
        });

        console.log('Transaction deleted successfully:', transactionId);

        // Update local state after successful deletion
        setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
      } else {
        console.log('Document not found');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (loading || isLoading) {
    return <div className="expense-income-details-page">Loading...</div>;
  }

  return (
    <div className="expense-income-details-page">
      <h2>Transaction List</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td>{transaction.type === "income" ? `+₹${transaction.amount}` : `-₹${transaction.amount}`}</td>
              <td>{transaction.category}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseIncomeDetailsPage;
