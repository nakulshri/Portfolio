import './Budget.css'; // Import SCSS file for styling
import React, { useEffect, useState } from "react";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from '../../lib/userStore';

const Budget = () => {
  const { currentUser, isLoading } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });
  const [budgets, setBudgets] = useState({
    food: 0,
    transport: 0,
    shopping: 0,
    utilities: 0
  });

  const [expenses, setExpenses] = useState({
    food: 0,
    transport: 0,
    shopping: 0,
    utilities: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchTransactions = async (userId) => {
    try {
      const docRef = doc(db, "userTransaction", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data; // Assuming data is an object with income and expense arrays
      } else {
        console.log("No such document!");
        return { income: [], expense: [] }; // Return empty arrays if document doesn't exist
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return { income: [], expense: [] }; // Return empty arrays on error
    }
  };

  const fetchBudget = async (userId) => {
    try {
      const docRef = doc(db, "userBudgets", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBudgets(data);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = currentUser.id; // Replace with currentUser.uid
        await fetchBudget(userId);
        const transactions = await fetchTransactions(userId);
        console.log("Fetched transactions:", transactions);

        // Initialize category-wise totals
        let foodExpense = 0;
        let transportExpense = 0;
        let shoppingExpense = 0;
        let utilitiesExpense = 0;

        // Calculate totals for expenses
        transactions.expense.forEach(transaction => {
          const { category, amount } = transaction;
          switch (category) {
            case 'food':
              foodExpense += amount;
              break;
            case 'transport':
              transportExpense += amount;
              break;
            case 'shopping':
              shoppingExpense += amount;
              break;
            case 'utilities':
              utilitiesExpense += amount;
              break;
            default:
              break;
          }
        });

        setExpenses({
          food: foodExpense,
          transport: transportExpense,
          shopping: shoppingExpense,
          utilities: utilitiesExpense
        });

      } catch (error) {
        console.error("Error fetching or calculating totals:", error);
      }
    };

    fetchData();
  }, [currentUser, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = currentUser.id; // Replace with currentUser.uid
      const userBudgetRef = doc(db, "userBudgets", userId);

      // Retrieve existing budget data
      const budgetSnap = await getDoc(userBudgetRef);
      const existingBudget = budgetSnap.exists() ? budgetSnap.data() : {};

      // Update the specific category with the new amount
      const updatedBudget = {
        ...existingBudget,
        [formData.category]: parseFloat(formData.amount)
      };

      await setDoc(userBudgetRef, updatedBudget);
      setBudgets(updatedBudget);
      console.log("Budget data saved successfully!");
    } catch (error) {
      console.error("Error saving budget data:", error);
    }
  };

  return (
    <section className="budget-setting-page">
  <form className="form" onSubmit={handleSubmit}>
    <h2 className="form-title">Set Budget Amount for Each Category</h2>

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
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="shopping">Shopping</option>
        <option value="utilities">Utilities</option>
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

    <button type="submit" className="save-btn">Save</button>
  </form>

  <div className="current-budget-overview">
    <h2 className="overview-title">Current Budget Overview</h2>
    <div className="table-container">
      <table className="budget-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Budgeted Amount</th>
            <th>Spent Amount</th>
            <th>Remaining Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(budgets).map((category) => (
            <tr key={category}>
              <td>{category}</td>
              <td>₹{budgets[category]}</td>
              <td>₹{expenses[category]}</td>
              <td>₹{budgets[category] - expenses[category]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>

  );
};

export default Budget;
