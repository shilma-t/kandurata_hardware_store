import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Driver from "./pages/driver/Driver"; 
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import LogisticsManagerDashboard from "./pages/Dashboard/LogisticsManagerDashboard";
import CashierDashboard from "./pages/Dashboard/CashierDashboard";
import HrManagerDashboard from "./pages/Dashboard/HrManagerDashboard";
import EmployeeDashboard from "./pages/Dashboard/EmployeeDashboard";
import LoginPage from "./pages/EmployeeLogin/EmployeeLogin";
import { useAuth } from "./context/authContext";
import DriverForm from "./pages/driver/DriverForm";
import DriverList from "./pages/driver/DriverList";
import EditDriver from "./pages/driver/EditDriver";
import Invoice from "./pages/Invoice/Invoice"; 
import InvoiceDisplay from "./pages/Invoice/InvoiceDisplay";
import UserTable from "./pages/User/UserTable";
import Sales from "./pages/Sales/Sales";
import SampleComponent from "./components/DeliverySchedule/SampleComponent"; 
import AssignedOrders from "./components/DeliverySchedule/AssignedOrders"; 
import ReplyForm from "./pages/Reply/ReplyForm";

import SupplierList from "./pages/Supplier/SupplierList";
import AddSupplier from "./pages/Supplier/AddSupplier";
import UpdateSupplier from "./pages/Supplier/UpdateSupplier";
import SupplierComponent from "./components/DeliverySchedule/SupplierComponet";

import AddEmployee from "./pages/Employee/AddEmployee"; 
import ListEmployee from "./pages/Employee/EmployeeList";
import EditEmployee from "./pages/Employee/EditEmployee";
import LeaveForm from "./pages/Leaves/LeaveForm";
import LeaveList from "./pages/Leaves/LeaveList";

import EmployeeRegister from "./pages/MainPage/EmployeeRegister"; 
import EmployeeLogin from "./pages/MainPage/EmployeeRegister";

import MainPage from "./pages/MainPage/MainPage";

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Routes>
        <Route path="/main" element={<MainPage />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/cashier" element={<CashierDashboard />} />
          <Route path="/hr" element={<HrManagerDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/logistics" element={<LogisticsManagerDashboard />} />
          <Route path="/drivers" element={<DriverList />} />
          <Route path="/drivers/add" element={<DriverForm />} />
          <Route path="/edit-driver/:id" element={<EditDriver />} />
          <Route path="/drivers/orders" element={<Driver />} />
         
          <Route path="/sample" element={<SampleComponent />} />
         
          <Route path="/assigned-orders" element={<AssignedOrders />} />{" "}
        
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice-display" element={<InvoiceDisplay />} />
          <Route path="/users" element={<UserTable />} />{" "}
        
          <Route path="/sales" element={<Sales />} />
          <Route path="/reply/:id" element={<ReplyForm />} />{" "}
     
          <Route path="/sup" element={<SupplierComponent />} />
          <Route path="/addSupplier" element={<AddSupplier />} />
          <Route path="/listSupplier" element={<SupplierList />} />
          <Route path="/updateSupplier/:id" element={<UpdateSupplier />} />
          <Route path="/add-employee" element={<AddEmployee />} />{" "}
      
          <Route path="/list-employee" element={<ListEmployee />} />{" "}
       
          <Route path="/edit-employee/:id" element={<EditEmployee />} />
          <Route path="/leaves/new" element={<LeaveForm />} />
          <Route path="/leaves" element={<LeaveList />} />
          <Route path="/register" element={<EmployeeRegister />} />
          <Route path="/adminLogin" element={<EmployeeLogin />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
