import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from '../../lib/userStore';
import "./dashboard.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { currentUser, isLoading } = useUserStore();
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpense: 0 });
  const [expenseCategories, setExpenseCategories] = useState({
    labels: [],
    data: [],
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

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

  const calculateMonthlyTotals = (transactions) => {
    const currentMonth = new Date().getMonth();
    let totalIncome = 0;
    let totalExpense = 0;

    if (transactions?.income?.forEach) {
      transactions.income.forEach((transaction) => {
        const entryDate = new Date(transaction.date);
        if (entryDate.getMonth() === currentMonth) {
          totalIncome += transaction.amount;
        }
      });
    }

    if (transactions?.expense?.forEach) {
      transactions.expense.forEach((transaction) => {
        const entryDate = new Date(transaction.date);
        if (entryDate.getMonth() === currentMonth) {
          totalExpense += transaction.amount;
        }
      });
    }

    return { totalIncome, totalExpense };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = currentUser.id; // Replace with currentUser.uid
        const transactions = await fetchTransactions(userId);
        console.log("Fetched transactions:", transactions);

        // Extract categories and their amounts from expense transactions only
        let categoryMap = new Map();

        transactions?.expense?.forEach(transaction => {
          const { category, amount } = transaction;
          if (categoryMap.has(category)) {
            categoryMap.set(category, categoryMap.get(category) - amount);
          } else {
            categoryMap.set(category, -amount);
          }
        });

        // Prepare data for the Pie chart (only expense data)
        const labels = Array.from(categoryMap.keys());
        const data = Array.from(categoryMap.values());

        setExpenseCategories({ labels, data });

        const allTransactions = [...(transactions.income?.map(transaction => ({ ...transaction, type: 'income' })) || []), ...(transactions.expense?.map(transaction => ({ ...transaction, type: 'expense' })) || [])];
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        // Set recent transactions (assuming first 5 transactions)
        const recent = allTransactions.slice(0, 4);
        setRecentTransactions(recent);

        const { totalIncome, totalExpense } = calculateMonthlyTotals(transactions);
        console.log("Monthly Totals - Income:", totalIncome, "Expense:", totalExpense);

        setTotals({ totalIncome, totalExpense });
      } catch (error) {
        console.error("Error fetching or calculating totals:", error);
      }
    };

    fetchData();
  }, [currentUser, isLoading]);

  const data = {
    labels: expenseCategories.labels,
    datasets: [
      {
        label: "Expenses",
        data: expenseCategories.data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="dashboard">
      <h1>Hello, <span>{currentUser.username}</span></h1>
      <hr className="custom-hr"/>
      <div className="summary">
        <div className="total">
          <h2>Summary</h2>
          <div className="container">
            <div className="income">
              <h2>Total Income</h2>
              <span>₹{totals.totalIncome}</span>
            </div>
            <div className="separator"></div>
            <div className="expense">
              <h2>Total Expense</h2>
              <span>₹{totals.totalExpense}</span>
            </div>
          </div>
          <div className="container2">
            <div className="income">
              <h2>Total Money</h2>
              <span>₹{totals.totalIncome - totals.totalExpense}</span>
            </div>
          </div>
        </div>
        <div className="chart">
          <Pie data={data} options={options} />
        </div>
      </div>
      <div className="recent">
        <h2>Recent Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>{transaction.type === "income" ? `+₹${transaction.amount}` : `-₹${transaction.amount}`}</td>
                <td>{transaction.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
