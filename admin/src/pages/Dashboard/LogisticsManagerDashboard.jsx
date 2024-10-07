import React from 'react';
import LogisticsManagerSidebar from "../../components/LogisticsManagerSidebar/LogisticsManagerSidebar";
import './LogisticsManagerDashboard.css'

const LogisticsManagerDashboard = () => {
  return (
    <div className="dashboard-container">
      <LogisticsManagerSidebar /> {/* Include the sidebar */}

      <div className="dashboard-content">
        <h1>Logistics Manager Dashboard</h1>
        
      </div>
    </div>
  );
};

export default LogisticsManagerDashboard;
