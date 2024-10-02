import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/" className="sidebar-option">
          <img className='dash_icon' src={assets.dashboard_icon} alt="Dashboard" />
          <p>Dashboard</p>
        </NavLink>

        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="Add Items" />
          <p>Add Items</p>
        </NavLink>

        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="List Items" />
          <p>Inventory</p>
        </NavLink>

        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>

        {/* New link to navigate to the user table page */}
        <NavLink to="/users" className="sidebar-option">
          <img src={assets.order_icon} alt="Users" />
          <p>Users</p>
        </NavLink>

        {/* New link to navigate to the sales page */}
        <NavLink to="/Sales" className="sidebar-option">
          <img src={assets.order_icon} alt="Sales" /> {/* Change the icon as necessary */}
          <p>Sales</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
