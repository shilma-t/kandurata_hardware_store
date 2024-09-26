import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './LogisticsManager.css';
import { Link } from 'react-router-dom';

function Dashboard() {
  const data = {
    labels: ['April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [
      {
        label: 'Sold Orders',
        data: [400, 600, 700, 540, 750, 800],
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
      {
        label: 'Rented Orders',
        data: [200, 300, 400, 140, 350, 400],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/sample">Manage Order</Link></li>
        <li><Link to="/drivers">Driver Details</Link></li>
        <li><Link to="/drivers/add">Add Driver</Link></li>
        <li><Link to="/edit-driver/:id">Edit Driver</Link></li>
        <li><Link to="/drivers">Delete Driver</Link></li>
        </ul>
      </div>
      <div className="main-content">
        <div className="stats">
          <div className="stat-box">
            <p>Orders</p>
            <h2>5</h2>
          </div>
          <div className="stat-box">
            <p>Orders delivered</p>
            <h2>5</h2>
          </div>
          <div className="stat-box">
            <p>Orders in progress</p>
            <h2>2</h2>
          </div>
          <div className="stat-box">
            <p>Orders failed</p>
            <h2>5</h2>
          </div>
        </div>
        <div className="chart-section">
          <h3>Delivered Orders</h3>
          <Line data={data} />
        </div>
      </div>
      <div>
      </div>
    </div>
    
  );
}

export default Dashboard;
