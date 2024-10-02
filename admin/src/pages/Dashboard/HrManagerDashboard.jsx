import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from "../Employee/EmployeeForm";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the auto table plugin
import './HrManagerDashboard.css'
import HrManagerDashboardSidebar from './HrManagerDashboardSidebar';

const HrManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employees');
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const results = employees.filter(employee =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(results);
  }, [searchQuery, employees]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5001/api/employees/${id}`);
        setEmployees(employees.filter(employee => employee._id !== id));
        setFilteredEmployees(filteredEmployees.filter(employee => employee._id !== id));
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting employee', error);
      Swal.fire('Error!', 'There was an error deleting the employee.', 'error');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text("Employee Report", 14, 10); // Add title
    doc.autoTable({
      head: [['First Name', 'Last Name', 'NIC', 'Contact Number', 'Email', 'DOB', 'Employee Type']],
      body: filteredEmployees.map(employee => [
        employee.firstName, 
        employee.lastName, 
        employee.nic, 
        employee.contactNumber, 
        employee.email, 
        new Date(employee.dob).toLocaleDateString(), 
        employee.employeeType
      ]),
    });
    
    doc.save('employee_report.pdf');
  };

  return (
    
      <div className="hr-dashboard-container">
      <HrManagerDashboardSidebar />
      <div className="main-content">
      <div className="container">
        <h1>Employee Management</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={generatePDF} className="generate-pdf-button">
          Generate PDF Report
        </button>
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <EmployeeForm
                onClose={handleCloseForm}
                onAddEmployee={(newEmployee) => setEmployees([...employees, newEmployee])}
                employee={selectedEmployee}
                setEmployees={setEmployees}
              />
            </div>
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>NIC</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Employee Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.nic}</td>
                <td>{employee.contactNumber}</td>
                <td>{employee.email}</td>
                <td>{new Date(employee.dob).toLocaleDateString()}</td>
                <td>{employee.employeeType}</td>
                <td>
                  <button className="actions-button edit" onClick={() => handleEdit(employee)}>Edit</button>
                  <button className="actions-button delete" onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default HrManagerDashboard;
