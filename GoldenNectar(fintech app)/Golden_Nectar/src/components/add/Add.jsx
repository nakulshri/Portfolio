import React, { useState, useEffect } from 'react';
import './AddExpenseIncomePage.css'; 
import ExpenseIncomeDetailsPage from './Details';
import { db } from '../../lib/firebase'; 
import { doc, getDoc, updateDoc, arrayUnion, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUserStore } from '../../lib/userStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
const AddExpenseIncomePage = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    description: '',
    type: 'expense'

  });

  useEffect(() => {
    const uid = currentUser.id; 
    fetchUserInfo(uid);
  }, [fetchUserInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.error('No current user.');
      return;
    }

    const userId = currentUser.id;
    const userTransactionRef = doc(db, 'userTransaction', userId);
    
    try {
      // Create newEntry object based on formData and type
      let newEntry = {
        id: uuidv4(),
        date: formData.date,
        amount: parseFloat(formData.amount),
        description: formData.description
      };

      // Add category field if type is 'expense'
      if (formData.type === 'expense') {
        newEntry.category = formData.category;
      }

      const docSnap = await getDoc(userTransactionRef);

      if (docSnap.exists()) {
        await updateDoc(userTransactionRef, {
          [formData.type]: arrayUnion(newEntry)
        });
      } else {
        // Create initial document with income or expense array
        await setDoc(userTransactionRef, {
          income: formData.type === 'income' ? [newEntry] : [],
          expense: formData.type === 'expense' ? [newEntry] : [],
        });
      }

      // Reset form data after submission
      setFormData({
        date: '',
        category: '',
        amount: '',
        description: '',
        type: 'expense' // Reset type to 'expense' after submission
      });

      console.log('Transaction added successfully:', newEntry);
      

    } catch (error) {
      console.error('Error adding document: ', error);
      
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="add-expense-income-page">
        <h1>Add Income / Expense</h1>
        <form className="form" onSubmit={handleAdd}>
        <div className="toggle-group">
            <input
              type="radio"
              id="expense"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
            />
            <label htmlFor="expense">Expense</label>
            <input
              type="radio"
              id="income"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
            />
            <label htmlFor="income">Income</label>
          </div>
          <label htmlFor="date" className="label">
            <span className="title">Date</span>
            <input
              className="input-field"
              type="date"
              id="date"
              name="date"
              title="Date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="category" className="label">
            <span className="title">Category</span>
            <select
  className="input-field"
  id="category"
  name="category"
  value={formData.category}
  onChange={handleChange}
  required
>
  <option value="">Select</option>
  {formData.type === 'expense' ? (
    <>
      <option value="food">Food</option>
      <option value="transport">Transport</option>
      <option value="shopping">Shopping</option>
      <option value="utilities">Utilities</option>
    </>
  ) : formData.type === 'income' ? (
    <>
      <option value="none">None</option>
    </>
  ) : null}
</select>

          </label>
          <label htmlFor="amount" className="label">
            <span className="title">Amount</span>
            <input
              className="input-field"
              type="number"
              id="amount"
              name="amount"
              title="Amount"
              placeholder="Enter amount ₹"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="description" className="label">
            <span className="title">Description</span>
            <textarea
              className="input-field-des"
              id="description"
              name="description"
              rows="5"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          
          <button type="submit" className="save-btn">Save</button>
        </form>
      </section>

      <ExpenseIncomeDetailsPage />
    </>
  );
};

export default AddExpenseIncomePage;
