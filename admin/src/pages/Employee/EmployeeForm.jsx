import React, {useState,useEffect} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import './EmployeeForm.css'
import HrManagerDashboardSidebar from '../Dashboard/HrManagerDashboardSidebar';

const EmployeeForm = ({ onClose, onAddEmployee, employee, setEmployees }) => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nic: '',
        contactNumber: '',
        email: '',
        dob: '',
        employeeType: ''
      });
    
      const [errors, setErrors] = useState({});
    
      useEffect(() => {
        if (employee) {
          setFormData(employee);
        }
      }, [employee]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const validateForm = () => {
        const newErrors = {};
        
        // First Name validation
        if (!formData.firstName) newErrors.firstName = 'First name is required.';
        
        // Last Name validation
        if (!formData.lastName) newErrors.lastName = 'Last name is required.';
        
        // NIC validation (must be 12 digits)
        if (!formData.nic) {
          newErrors.nic = 'NIC is required.';
        } else if (!/^\d{12}$/.test(formData.nic)) {
          newErrors.nic = 'NIC must be a 12-digit number.';
        }
        
        // Contact Number validation (must be 10 digits)
        if (!formData.contactNumber) {
          newErrors.contactNumber = 'Contact number is required.';
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
          newErrors.contactNumber = 'Contact number must be a 10-digit number.';
        }
        
        // Email validation
        if (!formData.email) {
          newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is not valid.';
        }
      
        // Date of Birth validation
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        if (!formData.dob) {
          newErrors.dob = 'Date of Birth is required.';
        } else if (formData.dob > today) {
          newErrors.dob = 'Date of Birth cannot be a future date.';
        }
        
        // Employee Type validation
        if (!formData.employeeType) newErrors.employeeType = 'Employee type is required.';
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
      
      
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        try {
          let response;
          if (employee) {
            // Update existing employee
            response = await axios.put(`http://localhost:5001/api/employees/${employee._id}`, formData);
            setEmployees(prevEmployees =>
              prevEmployees.map(emp => (emp._id === response.data._id ? response.data : emp))
            );
            Swal.fire('Success', 'Employee updated successfully', 'success');
          } else {
            // Create new employee
            response = await axios.post('http://localhost:5001/api/employees', formData);
            if (response.status === 201) {
              onAddEmployee(response.data); // Pass the new employee back to the parent
              Swal.fire();
            }
          }
          onClose();
        } catch (error) {
          console.error('There was an error!', error);
          const errorMessage = error.response?.data?.error || '';
          Swal.fire('');
        }
      };

  return (
    <div>
        <HrManagerDashboardSidebar/>
        <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </label>
      </div>
      <div className="form-group">
        <label>
          NIC:
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            required
          />
          {errors.nic && <span className="error">{errors.nic}</span>}
        </label>
        <label>
          Contact Number:
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
          {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
        </label>
      </div>
      <div className="form-group">
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          {errors.dob && <span className="error">{errors.dob}</span>}
        </label>
      </div>
      <div className="form-group">
        <label>
          Employee Type:
          <select
            name="employeeType"
            value={formData.employeeType}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee Type</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Logistic Manager">Logistic Manager</option>
            <option value="Cashier">Cashier</option>
          </select>
          {errors.employeeType && <span className="error">{errors.employeeType}</span>}
        </label>
      </div>
      <div className="button-group">
        <button type="submit">Submit</button>
        {!employee && <button type="button" onClick={onClose}>Cancel</button>}
      </div>
    </form>
    </div>
  )
}

export default EmployeeForm
