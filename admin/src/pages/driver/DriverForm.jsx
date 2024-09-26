import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
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
      <input
        name="mobileNumber"
        value={driver.mobileNumber}
        onChange={handleChange}
        placeholder="Mobile Number"
        required
      />
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
      <input
        name="vehicleModel"
        value={driver.vehicleModel}
        onChange={handleChange}
        placeholder="Vehicle Model"
        required
      />
      <button type="submit">Add Driver</button>
    </form>
  );
};

export default DriverForm;
