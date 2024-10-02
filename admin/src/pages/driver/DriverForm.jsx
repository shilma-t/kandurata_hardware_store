import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './DriverForm.css';

const DriverForm = () => {
  const [driver, setDriver] = useState({
    firstName: '',
    lastName: '',
    nicNumber: '',
    mobileNumber: '',
    homeAddress: '',
    emailAddress: '',
    vehicleModel: ''
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState({
    nicNumber: false,
    mobileNumber: false,
    emailAddress: false,
  });
  const navigate = useNavigate();

  const vehicleModels = [
    'Lorry',
    'Van',
    'Bike',
    'Three Wheeler',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
    
    // Clear previous error message on input change
    setErrors({ ...errors, [name]: '' });
    
    // Validate field on change
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let formErrors = { ...errors };
    let valid = false;

    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nicRegex = /^(200\d{8,10}|200\d{10}V)$/;

    switch (name) {
      case 'mobileNumber':
        valid = mobileRegex.test(value);
        formErrors.mobileNumber = valid ? '' : 'Mobile number must be 10 digits.';
        setIsValid({ ...isValid, mobileNumber: valid });
        break;
      case 'emailAddress':
        valid = emailRegex.test(value);
        formErrors.emailAddress = valid ? '' : 'Invalid email address format.';
        setIsValid({ ...isValid, emailAddress: valid });
        break;
      case 'nicNumber':
        valid = nicRegex.test(value);
        formErrors.nicNumber = valid ? '' : 'NIC number must be 12 digits or 11 digits followed by "V".';
        setIsValid({ ...isValid, nicNumber: valid });
        break;
      default:
        break;
    }

    setErrors(formErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure all fields are valid before submitting
    if (isValid.nicNumber && isValid.mobileNumber && isValid.emailAddress) {
      try {
        await axios.post('http://localhost:5001/drivers', driver);

        // Clear form
        setDriver({
          firstName: '',
          lastName: '',
          nicNumber: '',
          mobileNumber: '',
          homeAddress: '',
          emailAddress: '',
          vehicleModel: ''
        });

        // Navigate to the DriverList page after adding a driver
        navigate('/drivers');
      } catch (error) {
        console.error('Error adding driver:', error);
      }
    } else {
      // If any field is invalid, show error messages
      validateField('nicNumber', driver.nicNumber);
      validateField('mobileNumber', driver.mobileNumber);
      validateField('emailAddress', driver.emailAddress);
    }
  };

  return (
    <div className="driver-form-container">
      <div className="sidebar">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/sample">Manage Order</Link></li>
          <li><Link to="/drivers">Driver Details</Link></li>
          <li><Link to="/drivers/add">Add Driver</Link></li>
          <li><Link to="/drivers">Delete Driver</Link></li>
        </ul>
      </div>

      <div className="form-content">
        <h2 className="form-heading">Register New Driver</h2>
        <form onSubmit={handleSubmit} className="driver-form">
          <input
            name="firstName"
            value={driver.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            value={driver.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <input
            name="nicNumber"
            value={driver.nicNumber}
            onChange={handleChange}
            placeholder="NIC Number"
            required
          />
          {errors.nicNumber && <span className="error">{errors.nicNumber}</span>}
          <input
            name="mobileNumber"
            value={driver.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
          />
          {errors.mobileNumber && <span className="error">{errors.mobileNumber}</span>}
          <input
            name="homeAddress"
            value={driver.homeAddress}
            onChange={handleChange}
            placeholder="Home Address"
            required
          />
          <input
            name="emailAddress"
            value={driver.emailAddress}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
          {errors.emailAddress && <span className="error">{errors.emailAddress}</span>}
          
          {/* Dropdown for Vehicle Model */}
          <select 
            name="vehicleModel" 
            value={driver.vehicleModel} 
            onChange={handleChange} 
            required
          >
            <option value="" disabled>Select Vehicle Model</option>
            {vehicleModels.map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>

          <button type="submit">Add Driver</button>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;
