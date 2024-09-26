import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Driver from './pages/driver/Driver';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import LogisticsManagerDashboard from './pages/Dashboard/LogisticsManagerDashboard';
import CashierDashboard from './pages/Dashboard/CashierDashboard';
import HrManagerDashboard from './pages/Dashboard/HrManagerDashboard';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import LoginPage from './pages/adminLogin/AdminLoginPage';
import { useAuth } from './context/authContext';
import DriverForm from './pages/driver/DriverForm';
import DriverList from './pages/driver/DriverList';
import EditDriver from './pages/driver/EditDriver';
import MainPage from './pages/MainPage/MainPage';
import SampleComponent from './components/SampleComponent';
import AssignedOrders from './components/AssignedOrders'; // Import AssignedOrders component

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/logistics" element={<LogisticsManagerDashboard />} />
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/hr" element={<HrManagerDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/drivers" element={<DriverList />} />
          <Route path="/drivers/add" element={<DriverForm />} />
          <Route path="/drivers/edit/:id" element={<EditDriver />} />
          <Route path="/drivers/orders" element={<Driver />} />
          <Route path="/sample" element={<SampleComponent />} />
          <Route path="/assigned-orders" element={<AssignedOrders />} /> {/* New route */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
