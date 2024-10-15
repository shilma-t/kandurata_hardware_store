import React, { useState } from 'react';
import axios from 'axios';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    dateFrom: '',
    dateTo: '',
    leaveType: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/leaves', formData);
      alert('Leave request submitted successfully');
      setFormData({
        username: '',
        role: '',
        dateFrom: '',
        dateTo: '',
        leaveType: '',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username:</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      
      <label>Role:</label>
      <input type="text" name="role" value={formData.role} onChange={handleChange} required />
      
      <label>From:</label>
      <input type="date" name="dateFrom" value={formData.dateFrom} onChange={handleChange} required />
      
      <label>To:</label>
      <input type="date" name="dateTo" value={formData.dateTo} onChange={handleChange} required />
      
      <label>Leave Type:</label>
      <input type="text" name="leaveType" value={formData.leaveType} onChange={handleChange} required />
      
      <label>Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />
      
      <button type="submit">Submit Leave Request</button>
    </form>
  );
};

export default LeaveForm;
