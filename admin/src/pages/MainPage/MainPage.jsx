import React from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom'; 

const MainPage = () => {
  return (
    <div className="main-page">
      <h1 className="welcome-message">Welcome to Kandurata Hardware!</h1>
      <div className="button-container">
        <Link to="/logistics">
          <button className="nav-button">Logistic Manager</button>
        </Link>
        <Link to="/dashboard/admin">
          <button className="nav-button">Admin Dashboard</button>
        </Link>
        <Link to="/dashboard/cashier">
          <button className="nav-button">Cashier Dashboard</button>
        </Link>
        <Link to="/hr">
          <button className="nav-button">HR Manager</button>
        </Link>
        <Link to="/employee">
          <button className="nav-button">Employee Dashboard</button> {/* New button */}
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
