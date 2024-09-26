// SidebarDriver.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarDriver.css'; // Update the CSS file name accordingly

const SidebarDriver = () => {
  return (
    <div className="sidebar">
      <h3>Driver Management</h3>
      <ul>
        <li><Link to="/drivers">Driver List</Link></li>
        <li><Link to="/add-driver">Add Driver</Link></li>
        <li><Link to="/edit-driver">Edit Driver</Link></li>
        <li><Link to="/delete-driver">Delete Driver</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </div>
  );
};

export default SidebarDriver;
