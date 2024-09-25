import React, { useState } from 'react';
import axios from 'axios';
import '../driver/DriverList.css';

const DriverForm = ({ fetchDrivers }) => {
  const [driver, setDriver] = useState({
    firstName: '',
    lastName: '',
    nicNumber: '',
    mobileNumber: '',
    homeAddress: '',
    emailAddress: '',
    vehicleModel: ''
  });

  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5001/drivers', driver);
    fetchDrivers();
    setDriver({}); // Clear form
  };

  return (
    <form onSubmit={handleSubmit} className="driver-form">
      {/* Form fields for driver information */}
      <input name="firstName" onChange={handleChange} placeholder="First Name" required />
      <input name="lastName" onChange={handleChange} placeholder="Last Name" required />
      <input name="nicNumber" onChange={handleChange} placeholder="NIC Number" required />
      <input name="mobileNumber" onChange={handleChange} placeholder="Mobile Number" required />
      <input name="homeAddress" onChange={handleChange} placeholder="Home Address" required />
      <input name="emailAddress" onChange={handleChange} placeholder="Email Address" required />
      <input name="vehicleModel" onChange={handleChange} placeholder="Vehicle Model" required />
      <button type="submit">Add Driver</button>
    </form>
  );
};

export default DriverForm;
