import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import SalesGraph from "../../components/SalesGraph/SalesGraph";
import RevenueGraph from "../../components/Revenue/RevenueGraph";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/user/count');
        if (response.data.success) {
          setUserCount(response.data.count);
        } else {
          console.error('Failed to fetch user count');
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="admin-dashboard"> 
      <div className="adminSidebar"> 
        <ul className="sidebar-list"> 
          <li className="sidebar-item"><Link to="/">Dashboard</Link></li>
          <li className="sidebar-item"><Link to="/add">Add Items</Link></li>
          <li className="sidebar-item"><Link to="/list">Inventory</Link></li>
          <li className="sidebar-item"><Link to="/orders">Orders</Link></li>
          <li className="sidebar-item"><Link to="/users">Users</Link></li>
          <li className="sidebar-item"><Link to="/sales">Sales</Link></li>
        </ul>
      </div>
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Registered Users</h3>
            <p className="stat-value">{userCount}</p>
          </div>
        </div>

        <div className="graphs-container">
          <SalesGraph />
          <div className="revenue-graph-container">
            <RevenueGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
