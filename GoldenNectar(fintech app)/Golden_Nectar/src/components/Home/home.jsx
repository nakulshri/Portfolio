import { useState } from "react";
import "./home.css"
import Dashboard from "../DashBoard/Dashboard";

import AddExpenseIncomePage from "../add/Add";
import Budget from "../Budget/Budget";

import { auth } from "../../lib/firebase";

const Home = () => {
  const [current, setCurrent] = useState("home");

  const handleHome = () => {
    setCurrent("home");
  };

  const handleAddNav = () => {
    setCurrent("add");
  };

  const handleBudget = () => {
    setCurrent("budget");
  };

  

 

  // Function to render different pages based on current state
  const renderPage = () => {
    switch (current) {
      case "home":
        return <Dashboard />;
      case "add":
        return <AddExpenseIncomePage/>;
      case "budget":
        return <Budget/>;
      
      
      default:
        return <Dashboard />; // Default to home page if current state is unknown
    }
  };

  return (
    <div className="mainpage">
      <div className="navbar">
        <a onClick={handleHome}>Home</a>
        <a onClick={handleAddNav}>Income/Expense</a>
        <a onClick={handleBudget}>Budget</a>
        
        <button className="Logout" onClick={()=>auth.signOut()}>Logout</button>
        
      </div>
      <div className="content">
        {renderPage()} 
      </div>
    </div>
  );
};

export default Home;
