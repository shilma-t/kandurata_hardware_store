import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('/api/leaves');
        setLeaveRequests(response.data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, []);

  return (
    <div>
      <h2>Leave Requests</h2>
      <ul>
        {leaveRequests.map((leave) => (
          <li key={leave._id}>
            <p>Username: {leave.username}</p>
            <p>Role: {leave.role}</p>
            <p>From: {new Date(leave.dateFrom).toLocaleDateString()}</p>
            <p>To: {new Date(leave.dateTo).toLocaleDateString()}</p>
            <p>Leave Type: {leave.leaveType}</p>
            <p>Description: {leave.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveList;
