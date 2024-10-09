import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed for API requests
import Sidebar from "../../components/Sidebar/Sidebar";
import SalesGraph from "../../components/SalesGraph/SalesGraph"; // Import the graph component
import RevenueGraph from "../../components/Revenue/RevenueGraph"; // New component for revenue visualization
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/user/count'); // Ensure the API route is correct
        if (response.data.success) {
          setUserCount(response.data.count); // Update the state with the user count
        } else {
          console.error('Failed to fetch user count');
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount(); // Call the fetch function here
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Registered Users</h3>
            <p className="stat-value">{userCount}</p> {/* Display the fetched user count */}
          </div>
        </div>

        <div className="graphs-container">
          <div className="sales-graph-container">
            <SalesGraph />
          </div>
          <div className="revenue-graph-container">
            <RevenueGraph /> {/* New revenue graph component */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
