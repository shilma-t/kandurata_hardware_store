import Leave from '../models/Leave.js';

export const createLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = new Leave(req.body);
    await leaveRequest.save();
    res.status(201).json(leaveRequest);
  } catch (error) {
    console.error('Error saving leave request:', error);
    res.status(500).json({ message: 'Error saving leave request' });
  }
};

export const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await Leave.find();
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Error fetching leave requests' });
  }
};
