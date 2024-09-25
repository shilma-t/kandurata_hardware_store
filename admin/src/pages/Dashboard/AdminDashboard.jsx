import React from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";


const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        {/* Add Admin dashboard content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
