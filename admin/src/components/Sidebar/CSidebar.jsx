import React from 'react';
import './CSidebar.css';
import { NavLink } from 'react-router-dom';

const CSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        
      <NavLink to="/" className="sidebar-option">
          <p>Dashboard</p>
        </NavLink>

        <NavLink to="/dashboard/cashier" className="sidebar-option">
          <p>Sales</p>
        </NavLink>

        <NavLink to="/invoice-display" className="sidebar-option">
          <p>View Sales</p>
        </NavLink>
      </div>
    </div>
  );
};

export default CSidebar;
